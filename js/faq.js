document.addEventListener('DOMContentLoaded', () => {
    const allQuestions = document.querySelectorAll('.faq-question');
    
    allQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
        });
    });
});