import { ref, computed, onUnmounted } from 'vue'

/**
 * Game Timer composable for tracking elapsed time
 */
export function useGameTimer() {
  const elapsedMs = ref(0)
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(elapsedMs.value / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const totalSeconds = computed(() => Math.floor(elapsedMs.value / 1000))

  function start(initialMs = 0) {
    if (isRunning.value) return
    
    elapsedMs.value = initialMs
    isRunning.value = true
    
    intervalId = setInterval(() => {
      elapsedMs.value += 1000
    }, 1000)
  }

  function pause() {
    if (!isRunning.value) return
    
    isRunning.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function resume() {
    if (isRunning.value) return
    
    isRunning.value = true
    intervalId = setInterval(() => {
      elapsedMs.value += 1000
    }, 1000)
  }

  function reset() {
    pause()
    elapsedMs.value = 0
  }

  function stop(): number {
    pause()
    return elapsedMs.value
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    elapsedMs,
    isRunning,
    formattedTime,
    totalSeconds,
    start,
    pause,
    resume,
    reset,
    stop,
  }
}
