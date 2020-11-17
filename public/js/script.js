function non_user() {
    alert('Please register or login.')
}



function like(movid, user) {
    //attempting to send the the data via the add route to the movie.js file to update the database.
    if (document.images[movid.id].src == "http://localhost:3000/img/unlike.png") {
        let response = fetch('/auth/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: movid.id
            })

        });
        document.images[movid.id].src = "/img/like.png";
        document.images[movid.id].alt = 'Click to unlike';

    } else {
        let response = fetch('/auth/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: movid.id
            })

        });
        document.images[movid.id].src = "/img/unlike.png";
        document.images[movid.id].alt = 'Click to like';
    }
}