export function useTimer() {
  const elapsedTime = ref(0);
  const isRunning = ref(false);
  const isPaused = ref(false);

  let intervalId: NodeJS.Timeout | null = null;

  function start(): void {
    if (isRunning.value) return;

    isRunning.value = true;
    isPaused.value = false;

    intervalId = setInterval(() => {
      elapsedTime.value++;
    }, 1000);
  }

  function pause(): void {
    if (!isRunning.value || isPaused.value) return;

    isPaused.value = true;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function resume(): void {
    if (!isRunning.value || !isPaused.value) return;

    isPaused.value = false;
    intervalId = setInterval(() => {
      elapsedTime.value++;
    }, 1000);
  }

  function stop(): number {
    if (!isRunning.value) return elapsedTime.value;

    isRunning.value = false;
    isPaused.value = false;

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    return elapsedTime.value;
  }

  function reset(): void {
    stop();
    elapsedTime.value = 0;
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const formattedTime = computed(() => formatTime(elapsedTime.value));

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  return {
    elapsedTime,
    isRunning,
    isPaused,
    formattedTime,
    start,
    pause,
    resume,
    stop,
    reset,
    formatTime
  };
}
