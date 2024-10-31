//main functionality of extension

//searchbar and youtube functionality
const form = document.getElementById('myForm');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const searchVal = document.getElementById('search').value;
    loadVideos(searchVal);  // Load videos based on the search input
});


// Function to search for videos and return video IDs
async function Search(search) {
    try {
        // Call your backend endpoint
        const result = await fetch(`http://localhost:5001/api/search?q=${encodeURIComponent(search)}`);
        const r = await result.json();

        // Extract video IDs and create full URLs for embedding
        const e = r.items;
        const listOfLinks = e
            .filter(i => i.id.kind === 'youtube#video') // Ensure it's a video
            .map(i => `https://www.youtube.com/embed/${i.id.videoId}`); // Create full URL directly

        return listOfLinks;
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}



// Function to load videos into the container
async function loadVideos(search) {
    const videoLinks = await Search(search); // Assume Search returns an array of video URLs or IDs
    let container = document.getElementById('video-container');

    // Clear previous videos
    container.innerHTML = '';

    // Check if videoLinks array is empty
    if (videoLinks.length === 0) {
        container.innerHTML = '<p>No results found.</p>'; // Display a message if no results
        return;
    }

    // Loop through video links and append them as custom players with distinct positions
    videoLinks.forEach((link, index) => {
        let currDiv = document.createElement('div');
        currDiv.className = 'custom-video-container';
        currDiv.style.position = 'absolute';
        currDiv.style.top = `${170 + index * 180}px`; // Set distinct initial positions for each video, adjust to avoid overlap
        currDiv.style.left = '40px'; // Keep left position the same for better alignment
        currDiv.style.zIndex = '10';

        let iframe = document.createElement('iframe');
        iframe.src = link; // Embed YouTube video
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.className = 'custom-video';
        iframe.width = 640;
        iframe.height = 360;

        currDiv.appendChild(iframe);
        container.appendChild(currDiv);
    });

    enhanceDragAndDrop(); // Add this function call to enhance drag-and-drop
}



function enhanceDragAndDrop() {
    document.querySelectorAll('.custom-video-container').forEach(container => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        container.addEventListener('mousedown', function (e) {
            e.preventDefault();

            // Record the initial mouse position
            startX = e.clientX;
            startY = e.clientY;

            // Record the initial position of the container
            initialLeft = container.offsetLeft;
            initialTop = container.offsetTop;

            isDragging = true;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;

            // Calculate the new position based on the mouse movement delta
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            container.style.left = initialLeft + deltaX + 'px';
            container.style.top = initialTop + deltaY + 'px';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // Ensure the drag stops if the mouse leaves the window
        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
            }
        });

        container.ondragstart = function () {
            return false;
        };
    });
}









//dragging and picture in picture functionality below:

// Picture-in-Picture Functionality
// let currentPiPIframe = null; // To keep track of the currently opened PiP iframe

// function activatePiP(iframe) {
//     // Create a floating container for the video
//     let floatingDiv = document.createElement('div');
//     floatingDiv.className = 'floating-video';

//     // Create a unique iframe for the floating player
//     let floatingIframe = document.createElement('iframe');
//     floatingIframe.src = iframe.src + '?enablejsapi=1'; // Enable the YouTube API
//     floatingIframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
//     floatingIframe.allowFullscreen = true;

//     // Append the floating iframe to the floating container
//     floatingDiv.appendChild(floatingIframe);

//     // Create PiP button with .png image
//     const pipButton = document.createElement('img');
//     pipButton.src = 'images/pip-icon.png';  // Set your PiP icon image path
//     pipButton.className = 'pip-button';
//     pipButton.title = 'Close PiP';

//     // Add event listener to delete the PiP frame when clicking the PiP button in the floating window
//     pipButton.addEventListener('click', function() {
//         // Remove the floating div (this PiP frame)
//         document.body.removeChild(floatingDiv);
//     });
//     floatingDiv.appendChild(pipButton);

//     // Append the floating div to the body (detaching it from the extension frame)
//     document.body.appendChild(floatingDiv);

//     // Make the entire floating video draggable and resizable
//     makeDraggable(floatingDiv, floatingIframe);  // Pass both floatingDiv and iframe
//     makeResizable(floatingDiv);
// }

// function makeDraggable(element, iframe) {
//     let isDragging = false;
//     let mouseX = 0, mouseY = 0, offsetX = 0, offsetY = 0;

//     element.addEventListener('mousedown', function(event) {
//         // If the click is on a resizing handle, do not activate dragging
//         if (event.target.classList.contains('resize-handle')) return;

//         event.preventDefault();
//         isDragging = true;
//         offsetX = event.clientX - element.getBoundingClientRect().left;
//         offsetY = event.clientY - element.getBoundingClientRect().top;

//         // Disable pointer events on the iframe to enable dragging
//         iframe.style.pointerEvents = 'none';

//         document.addEventListener('mousemove', dragElement);
//     });

//     function dragElement(event) {
//         if (!isDragging) return;

//         event.preventDefault();
//         element.style.top = (event.clientY - offsetY) + "px";
//         element.style.left = (event.clientX - offsetX) + "px";
//     }

//     // Stop dragging when mouse is released
//     document.addEventListener('mouseup', function() {
//         isDragging = false;
//         iframe.style.pointerEvents = 'auto';  // Re-enable iframe pointer events
//         document.removeEventListener('mousemove', dragElement);
//     });
// }




// // Make the floating video resizable
// function makeResizable(element) {
//     const resizers = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

//     resizers.forEach(resizeCorner => {
//         let resizer = document.createElement('div');
//         resizer.className = 'resize-handle ' + resizeCorner;
//         element.appendChild(resizer);

//         resizer.addEventListener('mousedown', function(event) {
//             event.preventDefault();
//             window.addEventListener('mousemove', resize);
//             window.addEventListener('mouseup', stopResize);
//         });

//         function resize(event) {
//             // Resizing logic
//             if (resizeCorner.includes('right')) {
//                 element.style.width = (event.clientX - element.getBoundingClientRect().left) + 'px';
//             }
//             if (resizeCorner.includes('left')) {
//                 element.style.width = (element.getBoundingClientRect().right - event.clientX) + 'px';
//                 element.style.left = event.clientX + 'px';
//             }
//             if (resizeCorner.includes('bottom')) {
//                 element.style.height = (event.clientY - element.getBoundingClientRect().top) + 'px';
//             }
//             if (resizeCorner.includes('top')) {
//                 element.style.height = (element.getBoundingClientRect().bottom - event.clientY) + 'px';
//                 element.style.top = event.clientY + 'px';
//             }
//         }

//         function stopResize() {
//             window.removeEventListener('mousemove', resize);
//             window.removeEventListener('mouseup', stopResize);
//         }
//     });
// }
