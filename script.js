// --- script.js (COMPLETE NEW FILE V6 - FINAL) ---

document.addEventListener('DOMContentLoaded', () => {
    // --- UNIVERSAL PAGE LOAD & TRANSITION LOGIC ---
    document.body.classList.add('fade-in');

    document.querySelectorAll('.page-transition-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const destination = e.currentTarget.href;
            document.body.classList.remove('fade-in');
            setTimeout(() => { window.location.href = destination; }, 500);
        });
    });

    // --- NEW: MOBILE NAVIGATION --- 
    const burger = document.getElementById('nav-burger');
    const mobileMenu = document.getElementById('mobile-nav-menu');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            mobileMenu.classList.toggle('open');
        });
    }

    // --- PAGE-SPECIFIC LOGIC ---
    if (document.body.classList.contains('page-home')) {
        initHomePage();
    }
    
    // Init modals on any page that has stats
    if (document.querySelector('.stat') || document.querySelector('.mini-stat')) {
        initStatsModal();
    }
    
    // Accordion logic for info pages
    if (document.querySelector('.accordion')) {
        initAccordions();
    }
    
    // Game logic for game pages
    if (document.body.classList.contains('page-sort')) {
        initSortingGame();
    }
    if (document.body.classList.contains('page-soil')) {
        initCompostingGame();
    }
});

/**
 * Runs all scripts for the Home page.
 */
function initHomePage() {
        // --- WORD CYCLING EFFECT ---
        const cyclingWordElement = document.getElementById('cycling-word');
        if (cyclingWordElement) {
            const words = ['waste', 'rubbish', 'trash', 'garbage', 'litter', 'refuse'];
            let currentWordIndex = 0;
            
            const cycleWords = () => {
                const wordSpan = cyclingWordElement;
                
                // Animate out
                wordSpan.style.transform = 'translateY(-10px)';
                wordSpan.style.opacity = '0';
    
                setTimeout(() => {
                    // Change word
                    currentWordIndex = (currentWordIndex + 1) % words.length;
                    wordSpan.textContent = words[currentWordIndex];
                    
                    // Animate in
                    wordSpan.style.transform = 'translateY(10px)';
                    wordSpan.style.transition = 'none'; 
    
                    setTimeout(() => {
                        wordSpan.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
                        wordSpan.style.transform = 'translateY(0)';
                        wordSpan.style.opacity = '1';
                    }, 50);
    
                }, 400); // Time for fade out
            };
            
            // Set initial style for JS animation
            cyclingWordElement.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            
            // Start cycling after a delay
            setTimeout(() => {
                setInterval(cycleWords, 2500);
            }, 2000);
        }
    
        // --- SCROLL-ARROW LOGIC ---
        const scrollArrow = document.getElementById('scroll-arrow');
        const statsSection = document.getElementById('stats');
        if (scrollArrow && statsSection) {
            scrollArrow.addEventListener('click', () => {
                statsSection.scrollIntoView({ behavior: 'smooth' });
            });
            setTimeout(() => {
                if(scrollArrow) scrollArrow.style.opacity = '1';
            }, 5000);
        }
    
        // --- STATS ANIMATION ---
        animateStats();
    }
    
    /**
     * Initializes all accordions on a page
     */
    function initAccordions() {
        const accordions = document.querySelectorAll('.accordion-item');
        
        accordions.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                accordions.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').classList.remove('show');
                });
                
                // Open this item if it wasn't already active
                if (!isActive) {
                    item.classList.add('active');
                    content.classList.add('show');
                }
            });
        });
    }
    
    
    /**
     * Animates the stats section when it scrolls into view.
     */
    function animateStats() {
        const statsSection = document.getElementById('stats');
        if (!statsSection) return;
    
        let hasAnimated = false;
    
        const startAnimation = () => {
            if (hasAnimated) return;
            hasAnimated = true;
    
            // 1. Animate Bars & Piles
            document.querySelectorAll('.pile-segment[data-height]').forEach(pile => {
                pile.style.height = pile.dataset.height;
            });
            document.querySelectorAll('.bar-fill[data-width]').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
    
            // 2. Animate Donut Chart
            document.querySelectorAll('.donut-chart[data-percent]').forEach(chart => {
                const segment = chart.querySelector('.donut-segment');
                const percent = chart.dataset.percent;
                if (segment) {
                    const radius = segment.r.baseVal.value;
                    const circumference = 2 * Math.PI * radius;
                    const dasharray = (percent / 100) * circumference;
                    segment.style.strokeDasharray = `${dasharray} ${circumference}`;
                }
            });
    
            // 3. Animate Numbers
            document.querySelectorAll('.stat-number[data-target]').forEach(numberEl => {
                countUp(numberEl);
            });
        };
    
        // Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
    
        observer.observe(statsSection);
    
        // Fallback timer in case the observer doesn't fire
        setTimeout(() => {
            startAnimation();
        }, 1500);
    }/**
 * Counts a number element up to its data-target value.
 */
function countUp(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 1500; // 1.5 seconds
    const decimals = (target.toString().split('.')[1] || '').length;
    let start = 0;
    let startTime = null;

    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = progress * (2 - progress); // Ease-out quad
        
        let currentValue = start + (target - start) * easedProgress;
        el.textContent = currentValue.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            el.textContent = target.toFixed(decimals);
        }
    }
    requestAnimationFrame(animate);
}

/**
 * Initializes the click listeners for ALL stats modals (on any page).
 */
function initStatsModal() {
    const modal = document.getElementById('info-modal');
    // Only run if a modal exists on this page
    if (!modal) return; 
    
    const modalTitle = document.getElementById('modal-title');
    const modalInfo = document.getElementById('modal-info');
    const modalLink = document.getElementById('modal-link');
    const modalSource = modalLink.parentElement;
    const closeBtn = document.getElementById('modal-close-btn');

    // Find all clickable stats (homepage and info pages)
    const clickableStats = document.querySelectorAll('.stat[data-title], .mini-stat[data-title]');

    clickableStats.forEach(stat => {
        stat.addEventListener('click', () => {
            modalTitle.textContent = stat.dataset.title;
            modalInfo.textContent = stat.dataset.info;
            
            if (stat.dataset.link) {
                modalLink.href = stat.dataset.link;
                modalLink.textContent = stat.dataset.source || 'Source';
                modalSource.style.display = 'block';
            } else {
                modalSource.style.display = 'none';
            }
            
            modal.classList.add('visible');
        });
    });

    const closeModal = () => modal.classList.remove('visible');
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}


 // --- GAME DATA AND LOGIC ---

// --- 10 NEW ITEMS ADDED (28 TOTAL) ---
// --- !!! CRITICAL BUG FIX IN 'Citrus Peels' ASSET URL ---
const urbanItems = [
    { name: 'Plastic Bottle', age: '2 weeks old', bio: 'Single and ready to mingle... with other plastics at the recycling plant.', asset: 'https://images.unsplash.com/photo-1572459176121-de3eac8b8cc5?q=80&w=600&auto=format&fit=crop', category: 'recycle', tags: ['#PET1', '#Infinite'], details: { longevity: '450+ years', ideal_match: 'A clean, dry recycling bin. No food residue please!', turn_offs: 'Being thrown in general waste like common trash.', best_trait: 'I can become a fleece jacket or carpet.', worst_habit: 'Lingering around for literal centuries.' } },
    { name: 'Pizza Box', age: '1 hour old', bio: 'I look like clean cardboard, but deep down, I\'m a greasy mess. That grease makes me a recycling no-go.', asset: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=600&auto=format&fit=crop', category: 'landfill', tags: ['#Contaminated', '#Oily'], details: { longevity: '3 months', ideal_match: 'A compost bin if you tear me into small pieces (and I\'m not too greasy).', turn_offs: 'Recycling bins. My grease ruins the whole batch of paper.', best_trait: 'I held a delicious pizza.', worst_habit: 'Being a dream-crusher at the recycling plant.' } },
    { name: 'Glass Jar', age: '6 months old', bio: 'Sophisticated, timeless, and infinitely recyclable. Looking for someone who appreciates my transparency.', asset: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', category: 'recycle', tags: ['#Glass', '#Elegant'], details: { longevity: '1 Million years', ideal_match: 'A bottle bank where I can meet my glass family.', turn_offs: 'Being smashed carelessly. Handle with care!', best_trait: 'I never lose quality no matter how many times I\'m recycled.', worst_habit: 'Taking up space in landfills for literally forever.' } },
    { name: 'Used Battery', age: '1D year old', bio: 'I\'m full of heavy metals and toxic chemicals. Please don\'t just ghost me in a landfill, I need special treatment.', asset: 'https://images.unsplash.com/photo-1587854224976-f87c54d3346d?q=80&w=600&auto=format&fit=crop', category: 'repurpose', tags: ['#E-Waste', '#Hazardous'], details: { longevity: '100+ years', ideal_match: 'A special battery recycling point at a supermarket or recycling center.', turn_offs: 'The general waste bin. I leak and contaminate everything.', best_trait: 'I held so much power.', worst_habit: 'My toxic personality.' } },
    { name: 'Coffee Cup', age: '10 minutes old', bio: 'I look simple but I\'m complex inside. That plastic lining makes me a recycling nightmare. Sorry not sorry.', asset: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop', category: 'landfill', tags: ['#Composite', '#Problematic'], details: { longevity: '30 years', ideal_match: 'A specialist facility (good luck finding one).', turn_offs: 'Paper recycling bins - I contaminate everything.', best_trait: 'I keep your coffee hot and your hands cool.', worst_habit: 'Being a wolf in sheep\'s clothing in recycling.' } },
    { name: 'Newspaper', age: '1 day old', bio: 'I\'ve got yesterday\'s news, but I\'m ready for a new chapter. I\'m one of the easiest to recycle.', asset: 'https://images.unsplash.com/photo-1585241936939-be37034dae68?q=80&w=600&auto=format&fit=crop', category: 'recycle', tags: ['#Paper', '#Informed'], details: { longevity: '2-6 weeks', ideal_match: 'A dry paper recycling bin.', turn_offs: 'Getting wet. I fall apart and my fibers get ruined.', best_trait: 'I can be recycled up to 7 times.', worst_habit: 'Leaving inky fingerprints on you.' } },
    { name: 'Styrofoam Cup', age: '30 minutes old', bio: 'I am light, airy, and an environmental disaster. I basically never break down. Ever.', asset: 'https://images.unsplash.com/photo-1599381223963-228791dd1311?q=80&w=600&auto=format&fit=crop', category: 'landfill', tags: ['#Polystyrene', '#Forever'], details: { longevity: '500+ years', ideal_match: 'To have never been created in the first place. But since I\'m here... the landfill.', turn_offs: 'Recycling bins. I just break into tiny, polluting pieces.', best_trait: 'I am a very good insulator.', worst_habit: 'My eternal existence.' } },
    { name: 'Aluminum Can', age: '1month old', bio: 'The recycling world\'s golden child. I can be back on shelves in 60 days. Efficient, reliable, sustainable.', asset: 'https://images.unsplash.com/photo-1520637836862-4d197d17c13a?q=80&w=600&auto=format&fit=crop', category: 'recycle', tags: ['#Metal', '#Efficient'], details: { longevity: '200-500 years', ideal_match: 'Any recycling bin - I\'m valuable!', turn_offs: 'Being littered in parks and streets.', best_trait: 'Infinitely recyclable without quality loss.', worst_habit: 'Being so light I blow away easily.' } },
    { name: 'Plastic Bag', age: '3 days old', bio: 'They call me a "film" star, but not in a good way. I jam recycling machinery. Keep me out!', asset: 'https://images.unsplash.com/photo-1595278069441-283482a859c4?q=80&w=600&auto=format&fit=crop', category: 'landfill', tags: ['#Film', '#Jammer'], details: { longevity: '20-1000 years', ideal_match: 'A special "soft plastics" collection point at a supermarket.', turn_offs: 'Recycling bins. I get tangled in the sorting wheels and stop the whole factory.', best_trait: 'I am very good at holding things.', worst_habit: 'I look like a jellyfish to sea turtles.' } },
    { name: 'Old T-Shirt', age: '5 years old', bio: 'My best days are behind me, but I can still be useful. Don\'t just trash me, give me a new purpose.', asset: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop', category: 'repurpose', tags: ['#Textile', '#Reuse'], details: { longevity: 'Varies', ideal_match: 'A textile recycling bank, a charity shop, or being cut up into cleaning rags.', turn_offs: 'The landfill. Such a waste of good fibers.', best_trait: 'I\'m soft and absorbent.', worst_habit: 'I hold onto memories (and stains).' } },
    { name: 'Cereal Box', age: '1 week old', bio: 'I\'m simple, clean cardboard. Just flatten me and send me on my way to become a new box.', asset: 'https://images.unsplash.com/photo-1621980327460-5A513c3156c3?q=80&w=600&auto=format&fit=crop', category: 'recycle', tags: ['#Cardboard', '#Easy'], details: { longevity: '3 months', ideal_match: 'The paper recycling bin. Please remove my plastic inner bag first!', turn_offs: 'Being full of cereal. Empty me out.', best_trait: 'I\'m a perfect recycling candidate.', worst_habit: 'My plastic liner is often forgotten inside.' } },
    { name: 'Wine Bottle', age: '1 night old', bio: 'I\'ve seen some things, but I\'m ready to be reincarnated as a new bottle. Infinitely recyclable.', asset: 'https://images.unsplash.com/photo-1551028161-b849c5f8bc73?q=80&w=600&auto=format&fit=crop', category: 'recycle', tags: ['#Glass', '#Refillable'], details: { longevity: '1 Million years', ideal_match: 'A glass recycling bank. Rinse me out first.', turn_offs: 'General waste. I just sit there forever.', best_trait: 'My classic green (or brown, or clear) good looks.', worst_habit: 'I shatter under pressure.' } },
    { name: 'Broken Mug', age: '2 years old', bio: 'I\'m ceramic, not glass. Our chemistries don\'t mix. I can\'t be recycled with bottles.', asset: 'https://images.unsplash.com/photo-1600720185125-339c1c738e3a?q=80&w=600&auto=format&fit=crop', category: 'landfill', tags: ['#Ceramic', '#NotGlass'], details: { longevity: '1000+ years', ideal_match: 'The landfill. Or, I can be smashed up and used as drainage in a plant pot.', turn_offs: 'The glass recycling bin. I melt at a different temperature and ruin the whole batch.', best_trait: 'I held your morning coffee for years.', worst_habit: 'I break hearts (and then I\'m useless).' } },
    { name: 'Crisp Packet', age: '5 minutes old', bio: 'I\'m a complex mix of plastic and foil. Looks shiny, but I\'m a recycling nightmare.', asset: 'https://images.unsplash.com/photo-1619881589732-36b34d7a8033?q=80&w=600&auto=format&fit=crop', category: 'landfill', tags: ['#Composite', '#NotRecyclable'], details: { longevity: '80+ years', ideal_match: 'A specialist "Terracycle" bin. Otherwise, landfill.', turn_offs: 'The recycling bin. I contaminate the plastic stream.', best_trait: 'I keep crisps crunchy.', worst_habit: 'I\'m practically indestructible.' } },
    { name: 'Tin Foil (Clean)', age: '2 hours old', bio: 'I\'m aluminum, just like a can. Scrunch me into a big ball before you recycle me!', asset: 'https://images.unsplash.com/photo-1598343175440-1658c61b2b3a?q=80&w=600&auto=format&fit=crop', category: 'recycle', tags: ['#Metal', '#ScrunchedUp'], details: { longevity: '200-500 years', ideal_match: 'The recycling bin, but only if I\'m scrunched into a ball (at least 2 inches!).', turn_offs: 'Being flat. I fly around the sorting plant and get mistaken for paper.', best_trait: 'I can be recycled forever.', worst_habit: 'Being mistaken for trash if I\'m too small.' } },
    { name: 'Light Bulb (Old)', age: '3 years old', bio: 'I\'m an old incandescent. I\'m not hazardous, but I\'m not recyclable with glass bottles either.', asset: 'https://images.unsplash.com/photo-1547462402-d5e7a3f5c713?q=80&w=600&auto=format&fit=crop', category: 'landfill', tags: ['#MixedMaterial', '#NotGlass'], details: { longevity: '1000+ years', ideal_match: 'The general waste bin. My metal and glass are too hard to separate.', turn_offs: 'The glass bin. I ruin the glass melt.', best_trait: 'I had a bright idea once.', worst_habit: 'I\'m a one-hit wonder.' } },
    { name: 'Light Bulb (CFL)', age: '2 years old', bio: 'I\'m an energy-saver, but I contain mercury. I am HAZARDOUS waste. Never put me in the bin.', asset: 'https://images.unsplash.com/photo-1588701107146-3f6b86d67046?q=80&w=600&auto=format&fit=crop', category: 'repurpose', tags: ['#E-Waste', '#Hazardous'], details: { longevity: '100+ years', ideal_match: 'A special recycling point at a household waste centre. Handle me with care!', turn_offs: 'Any bin. If I break, I release mercury vapour.', best_trait: 'I saved you money on electricity.', worst_habit: 'I\'m toxic.' } },
    { name: 'Polystyrene Block', age: '1 month old', bio: 'I protected your new TV, but now my watch has ended. I am not recyclable in your home bin.', asset: 'https://images.unsplash.com/photo-1628102390447-da33989b1064?q=80&w=600&auto=format&fit=crop', category: 'landfill', tags: ['#Polystyrene', '#Bulky'], details: { longevity: '500+ years', ideal_match: 'A special polystyrene bin at a large recycling centre, if your council has one. If not, landfill.', turn_offs: 'The recycling bin. I just break into a million tiny, polluting balls.', best_trait: 'I\'m an excellent shock absorber.', worst_habit: 'I never, ever go away.' } }
];
const organicItems = [
    { name: 'Apple Core', age: '5 hours old', bio: 'Energetic, full of nitrogen, and ready to get things cooking in a hot pile.', asset: 'https://images.unsplash.com/photo-1543282253-2707a8575432?q=80&w=600&auto=format&fit=crop', category: 'accept', tags: ['#Greens', '#Nitrogen-Boost'], details: { decomposition: '2 months', ideal_match: 'A hot compost pile where I can break down fast.', turn_offs: 'The landfill, where I produce methane gas.', best_trait: 'I kickstart the composting party.', worst_habit: 'Sometimes I bring seeds with me.' } },
    { name: 'Grass Clippings', age: '2 days old', bio: 'Fresh cut, super green, and packed with nitrogen. I get hot, fast. Maybe too fast...', asset: 'https://images.unsplash.com/photo-1558244431-2db6d8559018?q=80&w=600&auto=format&fit=crop', category: 'super', tags: ['#Super-Green', '#Nitrogen'], details: { decomposition: '1-2 months', ideal_match: 'Being mixed with lots of "brown" material like leaves or cardboard.', turn_offs: 'Being dumped in a thick, wet mat. I get slimy and smelly.', best_trait: 'I heat up a compost pile instantly.', worst_habit: 'I can get a bit clingy and anaerobic.' } },
    { name: 'Autumn Leaves', age: '4 months old', bio: 'Dry, crunchy, and carbon-rich. I bring balance and structure to any relationship.', asset: 'https://images.unsplash.com/photo-1476519110428-518a2d75f841?q=80&w=600&auto=format&fit=crop', category: 'accept', tags: ['#Browns', '#Carbon-Rich'], details: { decomposition: '6-12 months', ideal_match: "A big pile with lots of green friends to balance me out.", turn_offs: 'Being wet and compacted. I need to breathe!', best_trait: 'I provide the slow-burn energy.', worst_habit: 'I can be a bit smothering if there are too many of me.' } },
    { name: 'Oily Salad Dressing', age: '1 week old', bio: 'I had good intentions with all those greens, but my oily nature is a no-go for a healthy compost pile.', asset: 'https://images.unsplash.com/photo-1540420773420-285f7fb28c68?q=80&w=600&auto=format&fit=crop', category: 'reject', tags: ['#Oils', '#NoGo'], details: { decomposition: 'Very slow', ideal_match: 'The bin. Sorry, but my oils suffocate the good microbes.', turn_offs: 'Any compost pile. I create waterproof layers and attract pests.', best_trait: 'I make salads taste great.', worst_habit: 'I ruin the delicate balance of a compost ecosystem.' } },
    { name: 'Cooked Meat', age: '1 day old', bio: 'I attract the wrong crowd (pests & pathogens). Best to keep me out of your home compost.', asset: 'https://images.unsplash.com/photo-1604135905183-52d3a3355541?q=80&w=600&auto=format&fit=crop', category: 'reject', tags: ['#Pathogens', '#Pests'], details: { decomposition: 'Varies', ideal_match: 'An industrial composter or anaerobic digester. Not your garden bin.', turn_offs: 'Summer heat. I get smelly, fast.', best_trait: 'I was delicious once.', worst_habit: 'I attract rats.' } },
    { name: 'Teabag', age: '4 hours old', bio: 'Most of me is great for compost, but many of my bags are sealed with non-biodegradable plastic. It\'s sneaky.', asset: 'https://images.unsplash.com/photo-1597352136926-cf7d61182823?q=80&w=600&auto=format&fit=crop', category: 'accept', tags: ['#Mostly-Good', '#Plastic?'], details: { decomposition: 'Varies', ideal_match: 'A pile where you can sift out the plastic mesh later, or just tear me open.', turn_offs: 'People who don\'t know about my hidden plastic.', best_trait: 'My insides are pure nitrogen-rich tea leaves.', worst_habit: 'My bag might be a "forever" material.' } },
    { name: 'Coffee Grounds', age: '2 hours old', bio: "They call me 'black gold' for a reason. I'm the perfect compost activator.", asset: 'https://images.unsplash.com/photo-1551030173-1a2a4a2a6c3c?q=80&w=600&auto=format&fit=crop', category: 'super', tags: ['#Super-Compost', '#pH-Neutral'], details: { decomposition: '3-6 months', ideal_match: 'Literally any compost pile. I get along with everyone.', turn_offs: 'Being thrown away. So much potential, wasted!', best_trait: 'I am packed with nitrogen and worms love me.', worst_habit: 'I can be a bit of a caffeine addict.' } },
    { name: 'Bread & Pasta', age: '3 days old', bio: 'I\'m a carb-lover\'s dream, but a pest magnet in a compost pile. Best to leave me out of it.', asset: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=600&auto=format&fit=crop', category: 'reject', tags: ['#Pest-Magnet', '#Grains'], details: { decomposition: 'Varies', ideal_match: 'The bin, or your council food waste collection.', turn_offs: 'Outdoor compost piles. I attract rodents and other unwanted guests.', best_trait: 'I am the ultimate comfort food.', worst_habit: 'Being too popular with pests.' } },
    { name: 'Egg Shells', age: '3 days old', bio: 'I bring valuable calcium to the party. A great addition to any compost pile.', asset: 'https://images.unsplash.com/photo-1588791393821-c7103c686e76?q=80&w=600&auto=format&fit=crop', category: 'accept', tags: ['#Browns', '#Calcium'], details: { decomposition: '1-2 years (unless crushed)', ideal_match: 'Being crushed up first to break down faster.', turn_offs: 'Being left whole.', best_trait: 'I add grit and minerals to the soil.', worst_habit: 'I take my sweet time to break down.' } },
    { name: 'Onion & Garlic', age: '1 week old', bio: 'I\'m a bit... potent. My strong smells can repel the friendly worms you want in your bin.', asset: 'https://images.unsplash.com/photo-1587597148819-A74B5e78b17b?q=80&w=600&auto-format&fit-crop', category: 'reject', tags: ['#Pungent', '#Worm-Repellent'], details: { decomposition: 'Slow', ideal_match: 'A council food waste bin. I\'m fine for industrial composting, just not home piles.', turn_offs: 'Home compost bins. I make the worms turn away.', best_trait: 'I add flavor to everything.', worst_habit: 'My smell is just too strong for the worms.' } },
    { name: 'Shredded Paper', age: '2 months old', bio: 'I\'m pure carbon. A perfect "brown" to balance out all your wet kitchen scraps.', asset: 'https://images.unsplash.com/photo-1543109740-03f39c3941a0?q=80&w=600&auto=format&fit=crop', category: 'accept', tags: ['#Browns', '#Carbon'], details: { decomposition: '6-8 months', ideal_match: 'A pile with lots of "greens". I absorb moisture and add air pockets.', turn_offs: 'Being in one giant clump. Mix me in well!', best_trait: 'I soak up excess moisture and prevent smells.', worst_habit: 'I can get matted and block air.' } },
    // --- THIS IS THE FIXED LINE ---
    { name: 'Citrus Peels', age: '1 day old', bio: 'I smell great, but my oils can be a bit much for some worms. Use me in moderation.', asset: 'https://images.unsplash.com/photo-1606595861935-391e0b0e0c0d?q=80&w=600&auto=format&fit=crop', category: 'accept', tags: ['#Greens', '#Acidic'], details: { decomposition: '6+ months', ideal_match: 'A hot compost pile, in small quantities. Too much of me can make the pile acidic.', turn_offs: 'Worm farms (vermicompost). The d-limonene in my peel is toxic to them.', best_trait: 'I smell fresh.', worst_habit: 'I can be a bit too acidic in large doses.' } },
    { name: 'Dairy (Milk, Cheese)', age: '4 days old', bio: 'I spoil fast and attract all the wrong kinds of visitors (maggots, rats). Keep me out!', asset: 'https://images.unsplash.com/photo-1628699310369-45c91f166161?q=80&w=600&auto=format&fit=crop', category: 'reject', tags: ['#Pests', '#Smelly'], details: { decomposition: 'Varies', ideal_match: 'The general waste bin or council food waste collection.', turn_offs: 'Any home compost bin. I will make it smell horrible and attract pests.', best_trait: 'I am a source of calcium.', worst_habit: 'I rot in the most unpleasant way possible.' } },
    { name: 'Banana Peel', age: '12 hours old', bio: 'I\'m packed with potassium and ready to break down. A fantastic addition to any compost pile.', asset: 'https://images.unsplash.com/photo-1571771894821-7FFFD0c35b3a?q=80&w=600&auto=format&fit=crop', category: 'super', tags: ['#Super-Green', '#Potassium'], details: { decomposition: '1-3 months', ideal_match: 'Any compost pile. I break down quickly and add tons of nutrients.', turn_offs: 'The landfill. Such a waste of potassium!', best_trait: 'I\'m a nutrient bomb for your future soil.', worst_habit: 'I look gross pretty quickly.' } },
    { name: 'Weeds (with seeds)', age: '1W week old', bio: 'I\'m organic, but my seeds are survivors. Put me in a home pile, and I\'ll take over your garden.', asset: 'https://images.unsplash.com/photo-1558032049-5dcb1b9b48b0?q=80&w=600&auto=format&fit=crop', category: 'reject', tags: ['#Invasive', '#Seeds'], details: { decomposition: 'Varies', ideal_match: 'A "hot" pile (over 60°C) which kills seeds. Or a council green waste bin.', turn_offs: 'A "cold" home compost pile. I\'ll just sprout again.', best_trait: 'I am very resilient.', worst_habit: 'I am very, very resilient.' } },
    { name: 'Pet Waste (Dog/Cat)', age: '6 hours old', bio: 'I might be "natural", but I carry pathogens that are dangerous to humans. Keep me out!', asset: 'https://images.unsplash.com/photo-1594243663862-5190af197f4c?q=80&w=600&auto=format&fit=crop', category: 'reject', tags: ['#Pathogens', '#Hazardous'], details: { decomposition: 'Varies', ideal_match: 'A special pet waste composter (if you have one) or the landfill.', turn_offs: 'Any compost pile used for growing food. I can transmit diseases.', best_trait: 'I... was a sign of a healthy pet?', worst_habit: 'I carry E. coli and other nasty bugs.' } },
    { name: 'Vacuum Dust', age: '1 week old', bio: 'I\'m mostly skin and dirt, but I also contain synthetic fibers from carpets. Best to leave me out.', asset: 'https://images.unsplash.com/photo-1587735243633-e187f4591f85?q=80&w=600&auto=format&fit=crop', category: 'reject', tags: ['#Synthetic', '#Contaminant'], details: { decomposition: 'Slow', ideal_match: 'The general waste bin.', turn_offs: 'The compost pile. I add microplastics and other non-organic bits.', best_trait: 'I made your floor clean.', worst_habit: 'I\'m a mix of everything you don\'t want.' } },
    { name: 'Fish Scraps', age: '1 day old', bio: 'Like meat, I\'m a magnet for pests and can create awful odours as I rot.', asset: 'https://images.unsplash.com/photo-1533779531488-c3e06d3b45c2?q=80&w=600&auto=format&fit=crop', category: 'reject', tags: ['#Pests', '#Smelly'], details: { decomposition: 'Varies', ideal_match: 'An industrial composter or the bin. Some Bokashi systems can handle me.', turn_offs: 'A home compost pile. I\'ll attract every cat and rat in the neighbourhood.', best_trait: 'I\'m full of nitrogen.', worst_habit: 'My smell is infamous.' } }
];

// --- GAME STATE ---
let currentItems = [];
let score = 0;
let currentMode = '';
let consecutiveCorrect = 0;
let gameActive = false;
let incorrectSorts = []; 

// --- DOM Element Refs ---
let streakCounterEl = null;
let streakNumberEl = null;
let rejectBtn = null;
let superBtn = null;
let acceptBtn = null;

// --- INITIALIZATION ---
function initSortingGame() {
    currentMode = 'sort';
    initGame();
}
function initCompostingGame() {
    currentMode = 'soil';
    initGame();
}
function initGame() {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return; 
    
    const highScore = localStorage.getItem(`sortAndSoilHighScore_${currentMode}`) || 0;
    
    const gameTitle = currentMode === 'sort' ? 'Binder' : 'Compostr';
    const gameEmoji = currentMode === 'sort' ? '♻️' : '🌱';
    
    // --- NEW: More detailed instructions ---
    const gameInstructions = currentMode === 'sort' 
        ? 'Swipe **Left** for Landfill, **Right** for Recycle, and **Up** for Repurpose. Click a card to learn more.'
        : 'Swipe **Left** to Reject, **Right** to Accept, and **Up** for Super-Compost. Click a card to learn more.';
        
    const gameRules = currentMode === 'sort' 
        ? '← Landfill  ↑ Repurpose  → Recycle'
        : '← Reject  ↑ Super-Compost  → Accept';
    
    gameContainer.innerHTML = `
        <div id="start-screen" class="game-screen">
            <div class="game-header">
                <h1 class="game-title font-display">${gameTitle}</h1>
                <p class="game-subtitle">${gameInstructions.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
                <div class="game-rules"><strong>${gameRules}</strong></div>
                <div class="high-score">🏆 High Score: ${highScore}</div>
            </div>
            <div class="game-mode-selection">
                <button class="cta-button" id="start-game-btn">${gameEmoji} Start Playing</button>
            </div>
        </div>
    `;
    document.getElementById('start-game-btn').addEventListener('click', () => startGame(currentMode));
}

function startGame(mode) {
    currentMode = mode;
    score = 0;
    consecutiveCorrect = 0;
    gameActive = true;
    incorrectSorts = [];
    const sourceItems = mode === 'sort' ? urbanItems : organicItems;
    
    currentItems = [...sourceItems]; 
    shuffleArray(currentItems);

    const gameContainer = document.getElementById('game-container');
    
    gameContainer.innerHTML = `
        <div class="game-screen">
            <div class="game-ui">
                <div class="streak-counter" id="streak-counter">
                    <span class="streak-number" id="streak-number">0</span>
                    <div class="streak-label">streak</div>
                </div>
                <div class="score-card">
                    <span class="score-number" id="score-display">0</span>
                    <div class="score-label">score</div>
                </div>
            </div>
            <div class="card-stack"></div>
            <div class="game-controls">
                <button class="control-btn reject" id="btn-reject"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                <button class="control-btn super" id="btn-super"><svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></button>
                <button class="control-btn accept" id="btn-accept"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></button>
            </div>
        </div>
    `;
    
    // Cache DOM elements
    streakCounterEl = document.getElementById('streak-counter');
    streakNumberEl = document.getElementById('streak-number');
    rejectBtn = document.getElementById('btn-reject');
    superBtn = document.getElementById('btn-super');
    acceptBtn = document.getElementById('btn-accept');

    rejectBtn.addEventListener('click', () => swipeProgrammatically('left'));
    superBtn.addEventListener('click', () => swipeProgrammatically('up'));
    acceptBtn.addEventListener('click', () => swipeProgrammatically('right'));

    for (let i = 0; i < Math.min(3, currentItems.length); i++) {
        loadNextCard();
    }
}

// --- CARD MANAGEMENT & INTERACTIONS ---
function loadNextCard() {
    if (document.querySelectorAll('.game-card').length > 3) return; 

    if (currentItems.length === 0) {
        if (document.querySelectorAll('.game-card').length === 0) {
            setTimeout(showGameComplete, 500);
        }
        return;
    }
    const item = currentItems.pop();
    const cardStack = document.querySelector('.card-stack');
    const card = createCard(item);
    
    cardStack.insertBefore(card, cardStack.firstChild);
}

function createCard(item) {
    const cardElement = document.createElement('div');
    cardElement.className = 'game-card';
    cardElement.dataset.category = item.category;
    cardElement.dataset.name = item.name;
    
    let tagClass = currentMode === 'sort' ? 'tag-sort' : 'tag-soil';
    if (item.category === 'repurpose' || item.category === 'super') tagClass = 'tag-special';
    let tagsHTML = item.tags.map(tag => `<span class="card-tag ${tagClass}">${tag}</span>`).join('');

    cardElement.innerHTML = `
        <div class="card-image" style="background-image: url('${item.asset}')"></div>
        <div class="card-info">
            <h2 class="card-name font-display">${item.name}, <span class="card-age">${item.age}</span></h2>
            <p class="card-bio">${item.bio}</p>
            <div class="card-tags">${tagsHTML}</div>
        </div>
    `;

    addCardInteractions(cardElement, item);
    return cardElement;
}

function addCardInteractions(cardElement, item) {
    let isDragging = false, startX = 0, startY = 0, currentX = 0, currentY = 0;
    let velocityX = 0, velocityY = 0, lastX = 0, lastY = 0, animFrame;
    const clickThreshold = 10;
    let clickStartTime = 0;
    const swipeThreshold = cardElement.offsetWidth * 0.25; 
    const buttonThreshold = cardElement.offsetWidth * 0.15; 

    function onPointerDown(e) {
        if (cardElement !== e.currentTarget.parentNode.lastElementChild || !gameActive) return;
        
        const pointer = e.touches ? e.touches[0] : e;
        startX = lastX = currentX = pointer.clientX;
        startY = lastY = currentY = pointer.clientY;
        clickStartTime = Date.now();
        isDragging = true;
        
        cardElement.style.transition = 'none';
        cardElement.classList.add('is-dragging');
        
        cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(updateVelocity);

        document.addEventListener('pointermove', onPointerMove, { passive: false });
        document.addEventListener('touchmove', onPointerMove, { passive: false });
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('touchend', onPointerUp);
    }
    
    function updateVelocity() {
        if (!isDragging) return;
        velocityX = currentX - lastX;
        velocityY = currentY - lastY;
        lastX = currentX;
        lastY = currentY;
        animFrame = requestAnimationFrame(updateVelocity);
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const pointer = e.touches ? e.touches[0] : e;
        currentX = pointer.clientX;
        currentY = pointer.clientY;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        cardElement.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX / 20}deg)`;

        // Light up buttons on drag
        if (deltaX < -buttonThreshold) {
            rejectBtn.classList.add('is-active');
        } else {
            rejectBtn.classList.remove('is-active');
        }
        if (deltaX > buttonThreshold) {
            acceptBtn.classList.add('is-active');
        } else {
            acceptBtn.classList.remove('is-active');
        }
        if (deltaY < -buttonThreshold) {
            superBtn.classList.add('is-active');
        } else {
            superBtn.classList.remove('is-active');
        }
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        cardElement.classList.remove('is-dragging');
        cancelAnimationFrame(animFrame);

        // Deactivate all buttons
        rejectBtn.classList.remove('is-active');
        acceptBtn.classList.remove('is-active');
        superBtn.classList.remove('is-active');

        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('touchmove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('touchend', onPointerUp);
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        const timeElapsed = Date.now() - clickStartTime;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < clickThreshold && timeElapsed < 300) {
            showDetailView(item);
            resetCardPosition();
            return;
        }

        let direction = 'none';
        const velocityThreshold = 5; // Velocity for a "flick"
        
        // TINDER-LIKE LOGIC:
        if (Math.abs(deltaX) > swipeThreshold) {
            direction = deltaX < 0 ? 'left' : 'right';
        } else if (deltaY < -swipeThreshold) {
            direction = 'up';
        }
        
        if (Math.abs(velocityX) > velocityThreshold || Math.abs(velocityY) > velocityThreshold) {
             if (Math.abs(velocityX) > Math.abs(velocityY) * 1.2) {
                direction = velocityX < 0 ? 'left' : 'right';
            } else if (velocityY < -velocityThreshold) {
                direction = 'up';
            }
        }
        
        if (direction !== 'none') {
            processSwipe(cardElement, direction);
        } else {
            resetCardPosition();
        }
    }
    
    const resetCardPosition = () => {
        cardElement.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        cardElement.style.transform = '';
    };

    cardElement.addEventListener('pointerdown', onPointerDown);
    cardElement.addEventListener('touchstart', onPointerDown, { passive: false });
}

// --- GAME LOGIC & UI ---
function swipeProgrammatically(direction) {
    const topCard = document.querySelector('.card-stack .game-card:last-child');
    if (topCard && gameActive) {
        processSwipe(topCard, direction);
    }
}

function processSwipe(card, direction) {
    if (!card || !gameActive) return;
    
    gameActive = false; 
    
    const itemCategory = card.dataset.category;
    let correct = false;
    let points = 0;

    const categoryMap = {
        sort: { left: 'landfill', right: 'recycle', up: 'repurpose' },
        soil: { left: 'reject', right: 'accept', up: 'super' }
    };

    if (categoryMap[currentMode][direction] === itemCategory) {
        correct = true;
        points = (direction === 'up') ? 25 : 10;
    }

    const feedbackEl = document.createElement('div');
    feedbackEl.className = `swipe-feedback ${correct ? 'correct' : 'wrong'}`;
    feedbackEl.textContent = correct ? 'Correct!' : 'Wrong!';
    card.appendChild(feedbackEl);

    if (correct) {
        consecutiveCorrect++;
        const streakBonus = Math.floor(consecutiveCorrect / 5) * 5;
        score += points + streakBonus;
        if (streakBonus > 0) showStreakBonus(streakBonus);
        document.body.classList.add('correct-flash');
    } else {
        consecutiveCorrect = 0;
        if (direction === 'up') {
            score = Math.max(0, score - 20); 
        } else {
            score = Math.max(0, score - 5); 
        }
        document.body.classList.add('wrong-flash');

        const sourceItems = currentMode === 'sort' ? urbanItems : organicItems;
        const incorrectItem = sourceItems.find(i => i.name === card.dataset.name);
        if (incorrectItem && !incorrectSorts.find(i => i.name === incorrectItem.name)) {
            incorrectSorts.push(incorrectItem);
        }
    }
    updateScoreDisplay();
    updateStreakDisplay();
    
    card.style.transition = 'all 0.5s ease-out';
    let transform;
    switch(direction) {
        case 'left': transform = 'translate(-150%, 50px) rotate(-30deg)'; break;
        case 'right': transform = 'translate(150%, 50px) rotate(30deg)'; break;
        case 'up': transform = 'translate(0, -150%) rotate(0deg)'; break;
    }
    card.style.transform = transform;
    card.style.opacity = '0';
    
    setTimeout(() => {
        card.remove();
        loadNextCard();
        gameActive = true; 
        document.body.classList.remove('correct-flash', 'wrong-flash');
    }, 500);
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) {
        if (scoreElement.textContent !== String(score)) {
            scoreElement.textContent = score;
            scoreElement.style.transform = 'scale(1.2)';
            setTimeout(() => { scoreElement.style.transform = 'scale(1)'; }, 200);
        }
    }
}

function updateStreakDisplay() {
    if (streakNumberEl) {
        streakNumberEl.textContent = consecutiveCorrect;
        if (consecutiveCorrect > 0) {
            streakNumberEl.classList.add('streak-pop');
            setTimeout(() => {
                streakNumberEl.classList.remove('streak-pop');
            }, 200);
        }
    }
}

function showStreakBonus(bonus) {
    const bonusElement = document.createElement('div');
    bonusElement.textContent = `+${bonus} streak!`;
    bonusElement.className = 'streak-bonus';
    document.body.appendChild(bonusElement);
    setTimeout(() => bonusElement.remove(), 2000);
}

function showDetailView(item) {
    const topCard = document.querySelector('.card-stack .game-card:last-child');

    const modal = document.createElement('div');
    modal.className = 'card-detail-modal';
    
    const detailKeys = {
        sort: ['longevity', 'ideal_match', 'turn_offs', 'best_trait', 'worst_habit'],
        soil: ['decomposition', 'ideal_match', 'turn_offs', 'best_trait', 'worst_habit']
    };

    const statsHTML = detailKeys[currentMode].map(key => {
        const label = key.replace(/_/g, ' ');
        return `<li><strong>${label}:</strong> ${item.details[key]}</li>`;
    }).join('');

    modal.innerHTML = `
        <div class="card-detail-content">
            <div class="detail-image" style="background-image: url('${item.asset}')"></div>
            <div class="detail-info">
                <h2 class="detail-title font-display">${item.name}</h2>
                <ul class="detail-stats">${statsHTML}</ul>
            </div>
            <button class="detail-close-btn">&times;</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
        if (topCard) topCard.classList.add('is-inactive');
        modal.classList.add('visible');
    });
    
    const closeModal = () => {
        if (topCard) topCard.classList.remove('is-inactive');
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    };

    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modal.querySelector('.detail-close-btn').addEventListener('click', closeModal);
}

// --- NEW: End-game screen with "Why" ---
function showGameComplete() {
    gameActive = false;
    const gameContainer = document.getElementById('game-container');
    const highScoreKey = `sortAndSoilHighScore_${currentMode}`;
    const currentHighScore = localStorage.getItem(highScoreKey) || 0;
    let isNewHighScore = false;
    
    if (score > currentHighScore) {
        localStorage.setItem(highScoreKey, score);
        isNewHighScore = true;
    }

    const otherMode = currentMode === 'sort' ? 'soil' : 'sort';
    const otherTitle = currentMode === 'sort' ? 'Compostr' : 'Binder';
    const otherPage = currentMode === 'sort' ? 'soil.html' : 'sort.html';
    
    let reviewHTML = '';
    if (incorrectSorts.length > 0) {
        // Helper map for categories
        const categoryNames = {
            'landfill': 'Landfill',
            'recycle': 'Recycle',
            'repurpose': 'Repurpose',
            'reject': 'Reject',
            'accept': 'Accept',
            'super': 'Super-Compost'
        };

        reviewHTML = `
            <div class="review-section">
                <h3 class="review-title font-display">Review Your Mismatches</h3>
                <div class="review-items">
                    ${incorrectSorts.map(item => `
                        <div class="review-card">
                            <img src="${item.asset}" alt="${item.name}" class="review-card-image" />
                            <div class="review-card-info">
                                <h4>${item.name}</h4>
                                <p>
                                    <strong>Correct:</strong> ${categoryNames[item.category] || item.category}
                                    <br>
                                    <strong>Why:</strong> ${item.details.ideal_match}
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    gameContainer.innerHTML = `
        <div class="game-screen end-screen">
            <div class="game-header">
                <h1 class="game-title font-display">Deck Cleared!</h1>
                <p class="game-subtitle">You've sorted through all the items. Here's how you did.</p>
                <div class="high-score" style="margin-top: 1rem;">Final Score: ${score}</div>
                 ${isNewHighScore ? `<p class="game-subtitle" style="color: var(--compost-green); margin-top: 1rem;">🎉 New High Score! 🎉</p>` : ''}
            </div>
            
            ${reviewHTML}

            <div class="game-mode-selection">
                <button class="cta-button" id="restart-btn">Play Again</button>
                <a href="${otherPage}" class="cta-button page-transition-link" style="background-color: var(--dark-text);">Try ${otherTitle}</a>
            </div>
        </div>
    `;

    // Re-bind page transition links on this new screen
    document.querySelectorAll('.page-transition-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const destination = e.currentTarget.href;
            document.body.classList.remove('fade-in');
            setTimeout(() => { window.location.href = destination; }, 500);
        });
    });

    document.getElementById('restart-btn').addEventListener('click', () => initGame());
    
    // Note: No detail view from review cards, as the "why" is already shown.
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}