
        document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const cinemaContainer = document.querySelector('.cinema-container');
            const seatingArea = document.getElementById('seating-area');
            const countElement = document.getElementById('count');
            const totalElement = document.getElementById('total');
            const movieSelect = document.getElementById('movie');
            const bookBtn = document.getElementById('book-btn');
            const screen = document.querySelector('.screen');
            const notification = document.getElementById('notification');
            const standardPriceElement = document.getElementById('standard-price');
            
            // Configuration
            const rows = 6;
            const seatsPerRow = 8;
            const vipRows = [0]; // First row is VIP
            const screenColors = ['#ff4757', '#6a11cb', '#2575fc', '#2ed573', '#ffa502'];
            const occupiedSeatsProbability = 0.2; // 20% chance a seat is occupied
            
            // State
            let ticketPrice = +movieSelect.value;
            let selectedSeats = [];
            let occupiedSeats = [];
            
            // Initialize
            generateSeats();
            loadOccupiedSeats();
            updateStandardPrice();
            
            // Screen animation
            let lastColorChange = 0;
            function animateScreen(timestamp) {
                if (!lastColorChange) lastColorChange = timestamp;
                const elapsed = timestamp - lastColorChange;
                
                if (elapsed > 5000) { // Change color every 5 seconds
                    const randomColor = screenColors[Math.floor(Math.random() * screenColors.length)];
                    screen.style.background = `linear-gradient(to bottom, ${randomColor}, #ddd)`;
                    lastColorChange = timestamp;
                }
                
                requestAnimationFrame(animateScreen);
            }
            
            // Start screen animation
            animateScreen();
            
            // Generate seats dynamically
            function generateSeats() {
                seatingArea.innerHTML = '';
                
                for (let row = 0; row < rows; row++) {
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'row';
                    
                    for (let seatNum = 0; seatNum < seatsPerRow; seatNum++) {
                        const seat = document.createElement('div');
                        seat.className = 'seat';
                        
                        // Check if seat is VIP
                        if (vipRows.includes(row)) {
                            seat.classList.add('vip');
                            seat.dataset.price = ticketPrice + 5;
                        } else {
                            seat.dataset.price = ticketPrice;
                        }
                        
                        // Check if seat is occupied
                        const seatId = `${row}-${seatNum}`;
                        if (occupiedSeats.includes(seatId)) {
                            seat.classList.add('occupied');
                        }
                        
                        seat.dataset.seatId = seatId;
                        rowDiv.appendChild(seat);
                    }
                    
                    seatingArea.appendChild(rowDiv);
                }
            }
            
            // Load occupied seats from localStorage or generate random ones
            function loadOccupiedSeats() {
                const savedOccupied = localStorage.getItem('occupiedSeats');
                if (savedOccupied) {
                    occupiedSeats = JSON.parse(savedOccupied);
                } else {
                    // Generate some random occupied seats
                    for (let row = 0; row < rows; row++) {
                        for (let seatNum = 0; seatNum < seatsPerRow; seatNum++) {
                            if (Math.random() < occupiedSeatsProbability) {
                                occupiedSeats.push(`${row}-${seatNum}`);
                            }
                        }
                    }
                    localStorage.setItem('occupiedSeats', JSON.stringify(occupiedSeats));
                }
            }
            
            // Save selected movie
            function setMovieData(movieIndex, moviePrice) {
                localStorage.setItem('selectedMovieIndex', movieIndex);
                localStorage.setItem('selectedMoviePrice', moviePrice);
            }
            
            // Update price display
            function updateStandardPrice() {
                standardPriceElement.textContent = ticketPrice;
            }
            
            // Update selected count and total
            function updateSelectedCount() {
                const selectedSeatElements = document.querySelectorAll('.seat.selected');
                selectedSeats = Array.from(selectedSeatElements).map(seat => seat.dataset.seatId);
                
                let totalPrice = 0;
                selectedSeatElements.forEach(seat => {
                    const isVip = seat.classList.contains('vip');
                    totalPrice += isVip ? ticketPrice + 5 : ticketPrice;
                });
                
                countElement.textContent = selectedSeats.length;
                totalElement.textContent = `$${totalPrice}`;
                
                // Update book button state
                bookBtn.disabled = selectedSeats.length === 0;
            }
            
            // Show notification
            function showNotification(message, duration = 3000) {
                notification.textContent = message;
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, duration);
            }
            
            // Create confetti effect
            function createConfetti() {
                const colors = ['#6a11cb', '#2575fc', '#ff4757', '#2ed573', '#f39c12'];
                const confettiCount = 100;
                
                for (let i = 0; i < confettiCount; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = `${Math.random() * 100}%`;
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 3000);
                }
            }
            
            // Event Listeners
            
            // Movie select change
            movieSelect.addEventListener('change', (e) => {
                ticketPrice = +e.target.value;
                setMovieData(e.target.selectedIndex, e.target.value);
                updateStandardPrice();
                generateSeats();
                updateSelectedCount();
                
                // Animation effect
                cinemaContainer.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    cinemaContainer.style.transform = 'scale(1)';
                }, 200);
                
                showNotification(`Movie changed to ${e.target.options[e.target.selectedIndex].text}`);
            });
            
            // Seat click
            seatingArea.addEventListener('click', (e) => {
                if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
                    e.target.classList.toggle('selected');
                    
                    // Click animation
                    if (e.target.classList.contains('selected')) {
                        e.target.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            e.target.style.transform = 'scale(1.1)';
                        }, 100);
                    } else {
                        e.target.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            e.target.style.transform = 'scale(1)';
                        }, 100);
                    }
                    
                    updateSelectedCount();
                }
            });
            
            // Book button click
            bookBtn.addEventListener('click', () => {
                if (selectedSeats.length === 0) return;
                
                // Disable button during booking
                bookBtn.disabled = true;
                bookBtn.textContent = 'Processing...';
                
                // Simulate API call
                setTimeout(() => {
                    // Mark seats as occupied
                    selectedSeats.forEach(seatId => {
                        if (!occupiedSeats.includes(seatId)) {
                            occupiedSeats.push(seatId);
                        }
                    });
                    
                    // Save to localStorage
                    localStorage.setItem('occupiedSeats', JSON.stringify(occupiedSeats));
                    
                    // Update UI
                    generateSeats();
                    selectedSeats = [];
                    updateSelectedCount();
                    
                    // Show success
                    bookBtn.textContent = 'Booking Confirmed!';
                    bookBtn.style.background = 'linear-gradient(to right, #2ed573, #1dd1a1)';
                    showNotification('Booking successful! Enjoy your movie!');
                    createConfetti();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        bookBtn.textContent = 'Confirm Booking';
                        bookBtn.style.background = 'linear-gradient(to right, var(--primary), var(--secondary))';
                    }, 2000);
                }, 1500);
            });
            
            // Load saved movie selection
            const savedMovieIndex = localStorage.getItem('selectedMovieIndex');
            if (savedMovieIndex !== null) {
                movieSelect.selectedIndex = savedMovieIndex;
                ticketPrice = +movieSelect.value;
                updateStandardPrice();
            }
        });