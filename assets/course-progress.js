(() => {
  const STORAGE_KEY = 'daraltai-course-progress-v1';
  const TOTAL = 7;

  const readProgress = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value)
        ? value.filter(n => Number.isInteger(n) && n >= 1 && n <= TOTAL)
        : [];
    } catch (_) {
      return [];
    }
  };

  const writeProgress = items => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...new Set(items)].sort((a, b) => a - b))
      );
    } catch (_) {}
  };

  const lesson = Number(document.body.dataset.lesson || 0);
  const visited = readProgress();

  if (lesson >= 1 && lesson <= TOTAL && !visited.includes(lesson)) {
    visited.push(lesson);
    writeProgress(visited);
  }

  document.querySelectorAll('[data-lesson-link]').forEach(link => {
    const number = Number(link.dataset.lessonLink);
    if (visited.includes(number)) link.classList.add('is-visited');
  });

  const count = visited.length;
  const percent = Math.round((count / TOTAL) * 100);

  document.querySelectorAll('[data-progress-count]').forEach(el => {
    el.textContent = String(count);
  });
  document.querySelectorAll('[data-progress-percent]').forEach(el => {
    el.textContent = String(percent);
  });
  document.querySelectorAll('[data-progress-bar]').forEach(el => {
    el.style.width = `${percent}%`;
  });

  const nextLesson =
    Array.from({ length: TOTAL }, (_, i) => i + 1).find(n => !visited.includes(n)) || 1;
  const continueLink = document.querySelector('[data-continue-course]');

  if (continueLink) {
    const lessonLinks = window.DARALTAI_LESSONS || [];
    const target = lessonLinks[nextLesson - 1];
    if (target) continueLink.href = target;
    continueLink.textContent = count === 0
      ? 'Начать курс'
      : count === TOTAL
        ? 'Пройти курс ещё раз'
        : `Продолжить с урока ${nextLesson}`;
  }
})();
