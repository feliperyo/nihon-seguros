// Debounce function para otimizar performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Menu toggle para dispositivos móveis
const menuToggle = document.querySelector('.menu-toggle');
const menuList = document.querySelector('.menu ul');

if (menuToggle && menuList) {
    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link (mobile)
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuList.classList.remove('active');
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !menuList.contains(e.target)) {
            menuList.classList.remove('active');
        }
    });
}

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header com efeito de scroll otimizado
const header = document.querySelector('.header');
let isScrolled = false;

const handleHeaderScroll = debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100 && !isScrolled) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(10px)';
        isScrolled = true;
    } else if (scrollTop <= 100 && isScrolled) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.backgroundColor = '#fff';
        header.style.backdropFilter = 'none';
        isScrolled = false;
    }
}, 10);

window.addEventListener('scroll', handleHeaderScroll);

// Intersection Observer para animações dos cards
const observeElements = () => {
    const cards = document.querySelectorAll('.card, .parceiro-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
};

// Formulário de contato otimizado com envio para WhatsApp
const contactForm = document.querySelector('.contato form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Verifica prevenção de spam
        if (!canSubmitForm()) return;

        // Validação básica
        const inputs = contactForm.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                showFieldError(input, 'Este campo é obrigatório');
                isValid = false;
            }
        });

        if (!isValid) return;

        // Pega os valores dos campos
        const nome = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const telefone = contactForm.querySelector('input[type="tel"]').value;
        const mensagem = contactForm.querySelector('textarea').value;

        // Monta a mensagem para o WhatsApp
        const whatsappMessage = `*Solicitação de Cotação - Nihon Seguros*

*Nome:* ${nome}
*E-mail:* ${email}
*Telefone:* ${telefone}
*Mensagem:* ${mensagem || 'Não informada'}

Enviado através do site da Nihon Seguros`;

        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Abre o WhatsApp
        window.open(`https://wa.me/5511947477696?text=${encodedMessage}`, '_blank');

        // Limpa o formulário
        contactForm.reset();
        clearAllErrors();

        // Mostra mensagem de sucesso
        showSuccessMessage();
    });
}

// Validação de formulário em tempo real
const inputs = document.querySelectorAll('.contato input, .contato textarea');
inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', () => clearError(input));
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Remove erro anterior
    clearError(field);

    // Validação para campos obrigatórios
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return;
    }

    // Validações específicas
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'E-mail inválido');
        }
    }

    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Telefone inválido');
        }
    }
}

function clearError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#ddd';
}

function clearAllErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    inputs.forEach(input => input.style.borderColor = '#ddd');
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;

    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

// Função para mostrar mensagem de sucesso otimizada
function showSuccessMessage() {
    // Remove mensagem anterior se existir
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    successDiv.textContent = 'Mensagem enviada! Redirecionando para o WhatsApp...';

    // Adiciona animação CSS se não existir
    if (!document.querySelector('#success-animation')) {
        const style = document.createElement('style');
        style.id = 'success-animation';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(successDiv);

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }
    }, 3000);
}

// Lazy loading otimizado para imagens
const lazyImages = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;

            if (img.complete) {
                img.style.opacity = '1';
            } else {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';

                const imageLoader = () => {
                    img.style.opacity = '1';
                    img.removeEventListener('load', imageLoader);
                    img.removeEventListener('error', imageLoader);
                };

                img.addEventListener('load', imageLoader);
                img.addEventListener('error', imageLoader);
            }

            imageObserver.unobserve(img);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

lazyImages.forEach(img => {
    img.style.opacity = '1';
    imageObserver.observe(img);
});

// Formatação automática do telefone
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }

        e.target.value = value;
    });
}

// Prevenção de spam no formulário
let formSubmissionCount = 0;
const maxSubmissions = 3;
const resetTime = 300000; // 5 minutos

function canSubmitForm() {
    if (formSubmissionCount >= maxSubmissions) {
        showErrorMessage('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
        return false;
    }

    formSubmissionCount++;

    // Reset contador após 5 minutos
    setTimeout(() => {
        if (formSubmissionCount > 0) formSubmissionCount--;
    }, resetTime);

    return true;
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }
    }, 4000);
}

// Otimização de performance: Throttle para eventos que disparam muito
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    observeElements();

    // Adiciona classe para animações CSS
    document.body.classList.add('loaded');

    // Verifica se há elementos requeridos
    const requiredElements = document.querySelectorAll('[required]');
    requiredElements.forEach(element => {
        element.addEventListener('invalid', (e) => {
            e.preventDefault();
            const message = element.validity.valueMissing ?
                'Este campo é obrigatório' :
                'Por favor, insira um valor válido';
            showFieldError(element, message);
        });
    });
});

// Preload de imagens importantes para melhor performance
function preloadImages() {
    const importantImages = [
        './assets/Logo.webp',
        './assets/hero-section.webp'
    ];

    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Detecção de conexão lenta para otimizações
if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Reduz animações para conexões lentas
        document.body.classList.add('reduced-motion');

        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicialização final
window.addEventListener('load', () => {
    preloadImages();

    // Remove loading states se houver
    document.body.classList.add('fully-loaded');
});