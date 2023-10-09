import { useEffect, RefObject } from 'react'

export default function useClickOutside(
  element: RefObject<HTMLElement>,
  callback: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        element.current &&
        !element.current.contains(event.target as Node) &&
        !element.current.isSameNode(event.target as Node)
      ) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [element, callback])
}
