// Menu toggle para dispositivos móveis
const menuToggle = document.querySelector('.menu-toggle');
const menuList = document.querySelector('.menu ul');

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

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header transparente no scroll
const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Adiciona sombra no header quando rola a página
    if (scrollTop > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.backgroundColor = '#fff';
        header.style.backdropFilter = 'none';
    }

    lastScrollTop = scrollTop;
});

// Animação dos cards ao entrar na viewport
const observeElements = () => {
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
};

// Formulário de contato
const contactForm = document.querySelector('.contato form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Pega os valores dos campos
        const nome = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const telefone = contactForm.querySelector('input[type="tel"]').value;
        const mensagem = contactForm.querySelector('textarea').value;

        // Monta a mensagem para o WhatsApp
        const whatsappMessage = `
Olá! Gostaria de solicitar uma cotação:

*Nome:* ${nome}
*E-mail:* ${email}
*Telefone:* ${telefone}
*Mensagem:* ${mensagem}
        `.trim();

        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Abre o WhatsApp
        window.open(`https://wa.me/5511947477696?text=${encodedMessage}`, '_blank');

        // Limpa o formulário
        contactForm.reset();

        // Mostra mensagem de sucesso
        showSuccessMessage();
    });
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = 'Mensagem enviada! Redirecionando para o WhatsApp...';

    // Adiciona animação CSS
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
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// Lazy loading para imagens - CORRIGIDO
const lazyImages = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;

            // Se a imagem já carregou, só aplica a transição
            if (img.complete) {
                img.style.opacity = '1';
                img.style.transition = 'opacity 0.3s ease';
            } else {
                // Se ainda não carregou, aguarda o carregamento
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';

                img.onload = () => {
                    img.style.opacity = '1';
                };

                // Fallback caso a imagem não carregue
                img.onerror = () => {
                    img.style.opacity = '1';
                };
            }

            imageObserver.unobserve(img);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '50px'
});

// Inicializa as imagens com opacity 1 por padrão
lazyImages.forEach(img => {
    img.style.opacity = '1';
    imageObserver.observe(img);
});

// Pausar animação do carrossel quando não está visível
const carrossel = document.querySelector('.carrossel');
const carrosselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const items = entry.target.querySelectorAll('.item');
        if (entry.isIntersecting) {
            items.forEach(item => {
                item.style.animationPlayState = 'running';
            });
        } else {
            items.forEach(item => {
                item.style.animationPlayState = 'paused';
            });
        }
    });
});

if (carrossel) {
    carrosselObserver.observe(carrossel);
}

// Validação de formulário em tempo real
const inputs = document.querySelectorAll('.contato input, .contato textarea');
inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearError);
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Remove erro anterior
    clearError(e);

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

function clearError(e) {
    const field = e.target;
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#ddd';
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.9rem;
        margin-top: 5px;
        text-align: left;
    `;
    errorDiv.textContent = message;

    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

// Inicializa as animações quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    observeElements();

    // Adiciona classe para animações CSS
    document.body.classList.add('loaded');
});

// Performance: debounce para scroll
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

// Aplica debounce no scroll
const debouncedScroll = debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.backgroundColor = '#fff';
        header.style.backdropFilter = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScroll);