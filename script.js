document.addEventListener("DOMContentLoaded", () => {
    
    // Array interno para armazenar o estado global do carrinho
    let cart = [];

    // SELEÇÃO DE ELEMENTOS DOM
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalValue = document.getElementById('cart-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCounts = document.querySelectorAll('.cart-count');
    
    const openCartNav = document.getElementById('cart-icon-nav');
    const openCartFloating = document.getElementById('floating-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // 1. GERENCIAMENTO DE REQUISIÇÕES DO CARRINHO (ABRIR / FECHAR)
    const toggleCart = () => cartSidebar.classList.toggle('open');
    
    if(openCartNav) openCartNav.addEventListener('click', (e) => { e.preventDefault(); toggleCart(); });
    if(openCartFloating) openCartFloating.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);

    // 2. FUNÇÃO ADICIONAR ITEM AO CARRINHO
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = parseFloat(card.getAttribute('data-price'));

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            updateCartDOM();
            
            // Abre o carrinho sutilmente para dar feedback visual
            if(!cartSidebar.classList.contains('open')) {
                cartSidebar.classList.add('open');
            }
        });
    });

    // 3. ATUALIZAÇÃO DA INTERFACE DO CARRINHO (DOM)
    function updateCartDOM() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-text">Seu carrinho está vazio.</p>';
            checkoutBtn.disabled = true;
            cartTotalValue.innerText = 'R$ 0,00';
            cartCounts.forEach(c => c.innerText = '0');
            return;
        }

        checkoutBtn.disabled = false;
        let total = 0;
        let totalItemsCount = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            totalItemsCount += item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span class="item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="item-quantity-controls">
                    <button class="btn-decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-increase" data-id="${item.id}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalValue.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        cartCounts.forEach(c => c.innerText = totalItemsCount);

        setupQuantityButtons();
    }

    // 4. BOTÕES INTERNOS DO CARRINHO (+ e -)
    function setupQuantityButtons() {
        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                if (item) item.quantity += 1;
                updateCartDOM();
            });
        });

        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const itemIndex = cart.findIndex(item => item.id === id);
                
                if (itemIndex > -1) {
                    cart[itemIndex].quantity -= 1;
                    if (cart[itemIndex].quantity === 0) {
                        cart.splice(itemIndex, 1);
                    }
                }
                updateCartDOM();
            });
        });
    }

    // 5. FINALIZAÇÃO DE COMPRA (Integração Direta com o WhatsApp)
    checkoutBtn.addEventListener('click', () => {
        const phoneNumber = "5511999999999"; // Substitua pelo número real do WhatsApp da cafeteria
        
        let message = `☕ *Novo Pedido - Doce Serena* ☕\n\n`;
        let total = 0;

        cart.forEach(item => {
            message += `• *${item.quantity}x* ${item.name} (R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')})\n`;
            total += item.price * item.quantity;
        });

        message += `\n💰 *Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
        message += `Por favor, confirme as informações do preparo e entrega.`;

        // Codifica o texto para o formato aceito em URLs de navegadores
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Limpa o carrinho e redireciona para fechar a compra
        cart = [];
        updateCartDOM();
        cartSidebar.classList.remove('open');
        
        window.open(whatsappUrl, '_blank');
    });

    // 6. MENU HAMBÚRGUER MOBILE
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if(menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 7. ANIMAÇÕES DE REVELAÇÃO NO SCROLL
    const revealElements = document.querySelectorAll('.reveal');
    const checkScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) element.classList.add('active');
        });
    };
    window.addEventListener('scroll', checkScroll);
    checkScroll();

    // 8. ROLAGEM DO BOTÃO HERO
    const btnCardapio = document.querySelector('.btn-cardapio');
    if(btnCardapio) {
        btnCardapio.addEventListener('click', () => {
            document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth' });
        });
    }
});