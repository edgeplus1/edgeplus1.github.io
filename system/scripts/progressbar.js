const scrollProgress = document.getElementById('scrollProgress');
        
function updateProgress() {
    // Получаем текущую позицию скролла
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Вычисляем полную высоту документа (берем максимальное значение)
    const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
    );
    
    // Вычисляем высоту прокручиваемой области
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollableHeight = docHeight - windowHeight;
    
    if (scrollableHeight <= 0) {
        scrollProgress.style.width = '0%';
        return;
    }
    
    // Вычисляем процент прокрутки
    const scrollPercent = (scrollTop / scrollableHeight) * 100;
    
    // Устанавливаем ширину прогресс-бара
    // Используем Math.min чтобы не превысить 100%
    scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
}

// Обновляем при скролле с debounce для производительности
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            updateProgress();
            ticking = false;
        });
        ticking = true;
    }
});

// Обновляем при загрузке
window.addEventListener('load', updateProgress);

// Обновляем при изменении размера
window.addEventListener('resize', updateProgress);
        
// Инициализация
updateProgress();