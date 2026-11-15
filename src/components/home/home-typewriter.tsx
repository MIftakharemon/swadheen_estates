'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@/i18n/locale-provider'
import { useMotionPreferences } from '@/experience/motion/motion-provider'

const phrases = {
  en: [
    'Homes that give you peace.',
    'Homes that unite your family.',
    'Homes that hold the dream.',
  ],
  bn: ['বাড়ি যা শান্তি এনে দেয়।', 'বাড়ি যা পরিবারকে এক করে।', 'বাড়ি যা স্বপ্ন আগলে রাখে।'],
}

const TYPE_MS = 55
const ERASE_MS = 28
const HOLD_MS = 2400
const GAP_MS = 400

export function HomeTypewriter() {
  const { locale } = useLocale()
  const { reducedMotion } = useMotionPreferences()
  const list = phrases[locale]
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(() => (reducedMotion ? (phrases[locale][0] ?? '') : ''))
  const [erasing, setErasing] = useState(false)
  const [caretFits, setCaretFits] = useState(true)
  const timerRef = useRef<number | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const caretRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (reducedMotion) {
      const id = window.setTimeout(() => setText(list[0] ?? ''), 0)
      return () => window.clearTimeout(id)
    }

    const full = list[index] ?? ''
    let delay = TYPE_MS

    if (!erasing) {
      delay = text.length < full.length ? TYPE_MS : HOLD_MS
    } else {
      delay = text.length > 0 ? ERASE_MS : GAP_MS
    }

    timerRef.current = window.setTimeout(() => {
      if (!erasing) {
        if (text.length < full.length) {
          setText(full.slice(0, text.length + 1))
        } else {
          setErasing(true)
        }
      } else if (text.length > 0) {
        setText(full.slice(0, text.length - 1))
      } else {
        setErasing(false)
        setIndex((current) => (current + 1) % list.length)
      }
    }, delay)

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [text, erasing, index, list, reducedMotion])

  // The caret follows the typed text, so on some viewport widths it would wrap
  // onto a fresh line past the reserved box. Hide it there instead of letting
  // it spill outside the headline.
  useEffect(() => {
    const caret = caretRef.current
    const typed = textRef.current
    if (!caret || !typed) return
    const caretBox = caret.getBoundingClientRect()
    const textBox = typed.getBoundingClientRect()
    const fits = caretBox.top < textBox.bottom - 1
    if (fits !== caretFits) setCaretFits(fits)
  }, [text, caretFits])

  const caretVisible = !reducedMotion

  return (
    <span className="relative block">
      <span aria-hidden="true" className="grid invisible">
        {list.map((phrase) => (
          <span key={phrase} className="block" style={{ gridArea: '1 / 1' }}>
            {phrase}
          </span>
        ))}
      </span>
      <span className="absolute inset-0">
        <span ref={textRef}>{text}</span>
        {caretVisible && (
          <span
            ref={caretRef}
            aria-hidden="true"
            className={`ml-1 inline-block w-[0.06em] shrink-0 animate-pulse bg-gold align-baseline${
              caretFits ? '' : ' invisible'
            }`}
            style={{ height: '0.72em' }}
          />
        )}
      </span>
      <span className="sr-only">{list.join('. ')}</span>
    </span>
  )
}
