document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('#login-btn');
    const passInput = document.querySelector('#password-input');
    const error = document.querySelector('#login-error');
    const loginBox = document.querySelector('.login-box');

    const handleLogin = () => {
        if (passInput.value.toLowerCase() === 'asal2026') {
            localStorage.setItem('asal_auth', 'true');

            gsap.to(loginBox, {
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.in',
                onComplete: () => {
                    window.location.replace('index.html');
                }
            });
        } else {
            error.classList.remove('hidden');
            loginBox.classList.add('shake');
            passInput.value = '';
            setTimeout(() => {
                loginBox.classList.remove('shake');
            }, 500);
        }
    };

    loginBtn.addEventListener('click', handleLogin);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Initial entrance animation
    gsap.from('.login-box', {
        scale: 0.9,
        opacity: 0,
        y: 20,
        duration: 1.2,
        ease: 'power3.out'
    });
});
