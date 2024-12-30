// Gallery Images Data
const galleryImages = [
    { src: 'assets/work1.jpg', alt: 'Boya Badana Çalışması 1' },
    { src: 'assets/work2.jpg', alt: 'Boya Badana Çalışması 2' },
    { src: 'assets/work3.jpg', alt: 'Boya Badana Çalışması 3' },
    { src: 'assets/work4.jpg', alt: 'Boya Badana Çalışması 4' }
];

// FAQ Accordion
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Diğer tüm açık soruları kapat
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            }
        });
        
        // Tıklanan soruyu aç/kapat
        if (!isOpen) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            item.classList.remove('active');
            answer.style.maxHeight = null;
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// // Intersection Observer for Animations
// const observerOptions = {
//     threshold: 0.1
// };

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.classList.add('fade-in');
//         }
//     });
// }, observerOptions);

// // Observe all sections
// document.querySelectorAll('section').forEach(section => {
//     observer.observe(section);
// });

// Price Calculator
const priceCalculator = {
    // Temel oda fiyatları (metrekare ve işçilik dahil)
    roomPrices: {
        1: 3000,  // 1+1 (45-50m²)
        2: 5000,  // 2+1 (70-80m²)
        3: 8000,  // 3+1 (100-120m²)
        4: 12000  // 4+1 (140m² ve üzeri)
    },

    // Durum çarpanları - Kötü durum = Daha fazla işçilik ve malzeme
    conditionMultipliers: {
        'iyi': 1.0,    // Sadece boya (ek işçilik yok)
        'orta': 1.3,   // Küçük tamirler (orta seviye işçilik)
        'kotu': 1.7,   // Kapsamlı hazırlık (yüksek işçilik)
        'tadilat': 2.2 // Tam tadilat (en yüksek işçilik)
    },

    // Mevcut renk çarpanları - Koyu renk = Daha fazla işçilik ve boya
    colorMultipliers: {
        'acik': 1.0,     // Açık renk (kolay kapatma)
        'orta': 1.4,     // Orta ton (normal kapatma)
        'koyu': 1.8,     // Koyu renk (zor kapatma)
        'cokkoyu': 2.3   // Çok koyu (en zor kapatma)
    },

    // Yeni renk çarpanları - Açık renk = Daha fazla kat ve işçilik
    newColorMultipliers: {
        'yeni-acik': 1.6,    // Açık ton (3-4 kat boya)
        'yeni-orta': 1.3,    // Orta ton (2-3 kat boya)
        'yeni-koyu': 1.1,    // Koyu ton (1-2 kat boya)
        'yeni-cokkoyu': 1.0  // Çok koyu (1 kat boya)
    },

    // Görünen etiketler
    roomLabels: {
        1: '1+1 (45-50m²)',
        2: '2+1 (70-80m²)',
        3: '3+1 (100-120m²)',
        4: '4+1 (140m²+)'
    },
    conditionLabels: {
        'iyi': 'İyi Durumda (Sadece Boya)',
        'orta': 'Orta Durumda (Küçük Tamirler)',
        'kotu': 'Kötü Durumda (Kapsamlı Hazırlık)',
        'tadilat': 'Tadilat Gerekli (Tam Renovasyon)'
    },
    colorLabels: {
        'acik': 'Açık Renk (Kolay İşlem)',
        'orta': 'Orta Ton (Normal İşlem)',
        'koyu': 'Koyu Renk (Zor İşlem)',
        'cokkoyu': 'Çok Koyu (En Zor İşlem)'
    },
    newColorLabels: {
        'yeni-acik': 'Açık Ton (3-4 Kat Boya)',
        'yeni-orta': 'Orta Ton (2-3 Kat Boya)',
        'yeni-koyu': 'Koyu Ton (1-2 Kat Boya)',
        'yeni-cokkoyu': 'Çok Koyu (1 Kat Boya)'
    },

    // Seçim durumları
    selectedRoom: null,
    selectedCondition: null,
    selectedColor: null,
    selectedNewColor: null,
    currentStep: 1,
    totalSteps: 4,

    // Fiyat hesaplama metodları
    calculateBasePrice: function() {
        return this.selectedRoom ? this.roomPrices[this.selectedRoom] : 0;
    },

    calculateConditionCost: function() {
        return this.selectedCondition ? this.conditionMultipliers[this.selectedCondition] : 1;
    },

    calculateColorCost: function() {
        return this.selectedColor ? this.colorMultipliers[this.selectedColor] : 1;
    },

    calculateNewColorCost: function() {
        return this.selectedNewColor ? this.newColorMultipliers[this.selectedNewColor] : 1;
    },

    calculateTotalPrice: function() {
        try {
            // Temel fiyat (oda büyüklüğüne göre)
            const basePrice = this.calculateBasePrice();
            if (basePrice === 0) return 0;

            let totalPrice = basePrice;
            
            // Duvar durumu etkisi
            const conditionMultiplier = this.calculateConditionCost();
            totalPrice *= conditionMultiplier;
            
            // Mevcut renk etkisi
            if (this.selectedColor) {
                const colorMultiplier = this.calculateColorCost();
                totalPrice *= colorMultiplier;
            }
            
            // Yeni renk etkisi
            if (this.selectedNewColor && this.selectedColor) {
                const newColorMultiplier = this.calculateNewColorCost();
                totalPrice *= newColorMultiplier;
                
                // Renk geçiş zorluğu
                const transitionMultiplier = calculateColorTransitionCost(this.selectedColor, this.selectedNewColor);
                totalPrice *= (1 + transitionMultiplier);
            }

            return Math.round(totalPrice);
        } catch (error) {
            console.error('Fiyat hesaplama hatası:', error);
            return this.calculateBasePrice();
        }
    }
};

function calculateColorTransitionCost(currentColor, newColor) {
    if (!currentColor || !newColor) return 0;

    const colors = {
        'acik': 1,
        'orta': 2,
        'koyu': 3,
        'cokkoyu': 4
    };

    try {
        const currentColorValue = colors[currentColor] || 1;
        const newColorValue = colors[newColor.replace('yeni-', '')] || 1;
        
        // Koyu renkten açık renge geçişte ek maliyet
        if (currentColorValue > newColorValue) {
            // Her ton farkı için %20 ek maliyet
            return (currentColorValue - newColorValue) * 0.2;
        }
        
        return 0;
    } catch (error) {
        console.error('Renk geçiş maliyeti hesaplama hatası:', error);
        return 0;
    }
}

function updatePrice() {
    const priceElement = document.querySelector('.price-amount');
    if (!priceElement) {
        console.error('Fiyat elementi bulunamadı');
        return;
    }

    try {
        const finalPrice = priceCalculator.calculateTotalPrice();
        const currentPrice = parseInt(priceElement.textContent.replace(/[^\d]/g, '')) || 0;
        
        if (finalPrice >= 0) {
            animatePrice(currentPrice, finalPrice, priceElement);
        } else {
            priceElement.textContent = '₺0';
        }
    } catch (error) {
        console.error('Fiyat güncelleme hatası:', error);
        priceElement.textContent = '₺0';
    }
}

function initPriceCalculator() {
    const question1 = document.getElementById('question1');
    const question2 = document.getElementById('question2');
    const question3 = document.getElementById('question3');
    const question4 = document.getElementById('question4');

    // İlk soruyu göster
    question1.classList.add('active');
    
    // Room selection
    question1.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleSelection(btn.dataset.value, 'room');
        });
    });
    
    // Condition selection
    question2.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleSelection(btn.dataset.value, 'condition');
        });
    });

    // Current color selection
    question3.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleSelection(btn.dataset.value, 'color');
        });
    });

    // New color selection
    question4.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleSelection(btn.dataset.value, 'newColor');
        });
    });

    // Back button functionality
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        const currentQuestion = document.querySelector('.question-container.active');
        if (currentQuestion) {
            const prevQuestion = currentQuestion.previousElementSibling;
            if (prevQuestion && prevQuestion.classList.contains('question-container')) {
                currentQuestion.classList.remove('active');
                prevQuestion.classList.add('active');
                priceCalculator.currentStep--;
                updateProgress();
                updateBackButton();
            }
        }
    });
}

function handleSelection(value, type) {
    // Seçimi kaydet ve sonraki adımı belirle
    let nextStep = 1;
    switch(type) {
        case 'room':
            priceCalculator.selectedRoom = value;
            nextStep = 2;
            break;
        case 'condition':
            priceCalculator.selectedCondition = value;
            nextStep = 3;
            break;
        case 'color':
            priceCalculator.selectedColor = value;
            nextStep = 4;
            break;
        case 'newColor':
            priceCalculator.selectedNewColor = value;
            break;
    }

    // Seçilen butonu işaretle
    const currentQuestion = document.querySelector('.question-container.active');
    if (currentQuestion) {
        currentQuestion.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.value === value) {
                btn.classList.add('selected');
            }
        });
    }

    // Seçimleri güncelle
    updateSelectedOptions();

    // Fiyatı güncelle
    updatePrice();

    // Bir sonraki soruya geç
    if (nextStep > 1) {
        const questions = document.querySelectorAll('.question-container');
        questions.forEach((q, index) => {
            if (index + 1 === nextStep) {
                q.classList.add('active');
                priceCalculator.currentStep = nextStep;
            } else {
                q.classList.remove('active');
            }
        });
    }

    // İlerleme çubuğunu güncelle
    updateProgress();
    updateBackButton();
}

function updateSelectedOptions() {
    // Oda seçimi gösterimi
    const selectedRoom = document.querySelector('.selected-room');
    if (selectedRoom && priceCalculator.selectedRoom) {
        selectedRoom.querySelector('span').textContent = priceCalculator.roomLabels[priceCalculator.selectedRoom];
        selectedRoom.classList.remove('hidden');
    }

    // Durum seçimi gösterimi
    const selectedCondition = document.querySelector('.selected-condition');
    if (selectedCondition && priceCalculator.selectedCondition) {
        selectedCondition.querySelector('span').textContent = priceCalculator.conditionLabels[priceCalculator.selectedCondition];
        selectedCondition.classList.remove('hidden');
    }

    // Mevcut renk seçimi gösterimi
    const selectedColor = document.querySelector('.selected-color');
    if (selectedColor && priceCalculator.selectedColor) {
        const colorLabel = priceCalculator.colorLabels[priceCalculator.selectedColor];
        if (colorLabel) {
            selectedColor.querySelector('span').textContent = colorLabel;
            selectedColor.classList.remove('hidden');
        }
    }

    // Yeni renk seçimi gösterimi
    const selectedNewColor = document.querySelector('.selected-new-color');
    if (selectedNewColor && priceCalculator.selectedNewColor) {
        const newColorLabel = priceCalculator.newColorLabels[priceCalculator.selectedNewColor];
        if (newColorLabel) {
            selectedNewColor.querySelector('span').textContent = newColorLabel;
            selectedNewColor.classList.remove('hidden');
        }
    }
}

function updateProgress() {
    const progressBar = document.querySelector('.progress');
    const progress = (priceCalculator.currentStep / priceCalculator.totalSteps) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateBackButton() {
    const activeQuestion = document.querySelector('.question-container.active');
    const questionNumber = parseInt(activeQuestion.querySelector('.question-number').textContent);
    const backButton = document.getElementById('backButton');
    backButton.disabled = questionNumber === 1;
}

// Testimonial Slider
const testimonialTrack = document.querySelector('.testimonial-track');
const testimonialItems = document.querySelectorAll('.testimonial-item');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Clone ilk ve son slide'ları
const firstClone = testimonialItems[0].cloneNode(true);
const lastClone = testimonialItems[testimonialItems.length - 1].cloneNode(true);

// Klonları ekle
testimonialTrack.appendChild(firstClone);
testimonialTrack.insertBefore(lastClone, testimonialItems[0]);

let currentSlide = 1; // İlk gerçek slide'dan başla
const totalSlides = testimonialItems.length;
let autoplayInterval;
let isTransitioning = false;

function updateSlider(transition = true) {
    if (transition) {
        testimonialTrack.style.transition = 'transform 0.5s ease-in-out';
    } else {
        testimonialTrack.style.transition = 'none';
    }
    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function handleSlideEnd() {
    if (currentSlide === 0) {
        testimonialTrack.style.transition = 'none';
        currentSlide = totalSlides;
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    if (currentSlide === totalSlides + 1) {
        testimonialTrack.style.transition = 'none';
        currentSlide = 1;
        testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    isTransitioning = false;
}

function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide++;
    updateSlider();
}

function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlide--;
    updateSlider();
}

function startAutoplay() {
    stopAutoplay(); // Önceki interval'i temizle
    autoplayInterval = setInterval(nextSlide, 4000); // 4 saniye
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
}

// Event Listeners
testimonialTrack.addEventListener('transitionend', handleSlideEnd);

prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoplay(); // Tıklamadan sonra autoplay'i yeniden başlat
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoplay(); // Tıklamadan sonra autoplay'i yeniden başlat
});

testimonialTrack.addEventListener('mouseenter', stopAutoplay);
testimonialTrack.addEventListener('mouseleave', startAutoplay);

// Initialize
updateSlider(false);
startAutoplay();

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initPriceCalculator();
});

function animatePrice(start, end, element) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = `₺${current.toLocaleString()}`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}
