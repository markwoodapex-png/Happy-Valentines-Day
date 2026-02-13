/**
 * Professional 3D Valentine Website for Asal & Hamid
 * Enhanced with Gift Segment and Memories Gallery
 */

class ValentineScene {
    constructor() {
        this.canvas = document.querySelector('#bg-canvas');
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.clock = new THREE.Clock();
        this.heart = null;
        this.particles = null;
        this.currentSection = 'hero';

        this.init();
        this.createParticles();
        this.createHeart();
        this.setupLights();
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupModal();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0005);
        this.scene.fog = new THREE.FogExp2(0x0a0005, 0.05);

        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 5);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    createParticles() {
        const count = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
            colors[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createHeart() {
        const shape = new THREE.Shape();
        const x = 0, y = 0;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        shape.bezierCurveTo(x - 3, y + 5.5, x - 1, y + 7.7, x + 2.5, y + 9.5);
        shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 5.5, x + 8, y + 3.5);
        shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

        const extrudeSettings = {
            depth: 2,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();

        const material = new THREE.MeshPhongMaterial({
            color: 0xff4d6d,
            emissive: 0x4d0404,
            specular: 0xffffff,
            shininess: 100,
            flatShading: false
        });

        this.heart = new THREE.Mesh(geometry, material);
        this.heart.scale.set(0.1, 0.1, 0.1);
        this.heart.rotation.x = Math.PI;
        this.scene.add(this.heart);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffb6c1, 10);
        pointLight.position.set(2, 3, 4);
        this.scene.add(pointLight);

        const goldLight = new THREE.PointLight(0xd4af37, 5);
        goldLight.position.set(-3, -2, 2);
        this.scene.add(goldLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.querySelectorAll('nav a, .scroll-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('data-nav') || btn.getAttribute('data-target');
                this.navigateTo(target);
            });
        });

        // Login Logic
        const loginBtn = document.querySelector('#login-btn');
        const passInput = document.querySelector('#password-input');

        if (loginBtn && passInput) {
            loginBtn.addEventListener('click', () => this.handleLogin());
            passInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleLogin();
            });
        }

        window.addEventListener('mousemove', (e) => {
            if (!this.heart) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = -(e.clientY / window.innerHeight - 0.5) * 2;

            gsap.to(this.heart.rotation, {
                x: Math.PI + y * 0.2,
                y: x * 0.3,
                duration: 2,
                ease: 'power2.out'
            });
        });
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-links a');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('is-active');
                navLinks.classList.toggle('active');
            });
        }

        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navLinks.classList.remove('active');
            });
        });
    }

    setupModal() {
        const giftBtn = document.querySelector('.gift-btn');
        const modal = document.getElementById('gift-modal');
        const closeBtn = document.querySelector('.close-modal');

        if (giftBtn) {
            giftBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
                gsap.from('.modal-content', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' });
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const video = document.getElementById('gift-video');
                if (video) video.pause();

                gsap.to('.modal-content', {
                    scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
                        modal.style.display = 'none';
                    }
                });
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) closeBtn.click();
        });
    }

    navigateTo(sectionId) {
        if (this.currentSection === sectionId) return;

        const p = {
            hero: { px: 0, py: 0, pz: 5, rx: 0, ry: 0 },
            story: { px: -4, py: 0, pz: 9, rx: 0, ry: 0.5 },
            memories: { px: 0, py: 5, pz: 10, rx: -0.5, ry: 0 },
            gift: { px: 4, py: 0, pz: 7, rx: 0, ry: -0.5 },
            message: { px: 0, py: 0, pz: 2, rx: 0.2, ry: 0 }
        };

        const pos = p[sectionId];

        gsap.to(this.camera.position, {
            x: pos.px,
            y: pos.py,
            z: pos.pz,
            duration: 2.5,
            ease: 'power3.inOut'
        });

        gsap.to(this.camera.rotation, {
            x: pos.rx,
            y: pos.ry,
            duration: 2.5,
            ease: 'power3.inOut'
        });

        document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');

        document.querySelectorAll('nav a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('data-nav') === sectionId);
        });

        this.currentSection = sectionId;

        gsap.from(`#${sectionId} .reveal-text, #${sectionId} .memory-card`, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.5
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const elapsedTime = this.clock.getElapsedTime();

        if (this.heart) {
            this.heart.position.y = Math.sin(elapsedTime) * 0.1;
            this.heart.scale.setScalar(0.1 + Math.sin(elapsedTime * 2) * 0.005);
        }

        if (this.particles) {
            this.particles.rotation.y = elapsedTime * 0.05;
        }

        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    hideLoader() {
        setTimeout(() => {
            const loader = document.querySelector('.loader-wrapper');
            if (loader) loader.style.opacity = '0';
            setTimeout(() => {
                if (loader) loader.style.display = 'none';
                this.navigateTo('hero');
            }, 1000);
        }, 1500);
    }

    handleLogin() {
        const input = document.querySelector('#password-input');
        const error = document.querySelector('#login-error');
        const overlay = document.getElementById('login-overlay');
        const loginBox = document.querySelector('.login-box');
        const content = document.getElementById('main-content');

        if (input.value.toLowerCase() === 'asal2026') {
            // Success

            gsap.to(loginBox, {
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.in'
            });

            gsap.to(overlay, {
                opacity: 0,
                duration: 1,
                delay: 0.3,
                onComplete: () => {
                    overlay.style.display = 'none';
                    content.classList.remove('hidden');
                    this.hideLoader();
                }
            });
        } else {
            error.classList.remove('hidden');
            loginBox.classList.add('shake');
            input.value = '';
            setTimeout(() => loginBox.classList.remove('shake'), 500);
        }
    }
}

window.onload = () => {
    new ValentineScene();
};
