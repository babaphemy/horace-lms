import { getLabSubmissionsKey, getSkillCertificatesKey } from "@/utils/labs"

const progressEvent = "horace-lab-progress-updated"

export function notifyLabProgress() {
  window.dispatchEvent(new Event(progressEvent))
}

export function subscribeLabProgress(userId: string, refresh: () => void) {
  const keys = [getLabSubmissionsKey(userId), getSkillCertificatesKey(userId)]
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || keys.includes(event.key)) refresh()
  }
  window.addEventListener("storage", onStorage)
  window.addEventListener("focus", refresh)
  window.addEventListener(progressEvent, refresh)
  refresh()
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener("focus", refresh)
    window.removeEventListener(progressEvent, refresh)
  }
}
