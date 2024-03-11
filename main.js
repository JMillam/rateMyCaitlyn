// TODO Make the input area prettier
//* TODO Display date of comment - DONE
//* TODO Display the role of comment as the picture - DONE
//* TODO Get the API hosted online
//* TODO Set up the website to be ran through github
// TODO Look into RIOT API integration



console.log("hello");

const date = new Date()
getCurrentDateString = function(){
    return `${date.toLocaleDateString()}`
}

console.log(date.toLocaleDateString())

// Testing Fetch on local server
fetch("http://localhost:3000", {
    method: 'GET'
})
    .then(response => response.json())
    .then(value => console.log(value.body))
    .catch(error => console.log(error))
    .finally(() => {console.log("hi")});
//



// Fetching all of the previous comments from the JSON file, also showing all of the comments
let commentObjetcs = [];
fetch("comments.json")
    .then(response => response.json())
    .then(values => commentObjetcs = values)
    .catch(error => console.log(error))
    .finally(() => showComments(commentObjetcs));
//

// Showing the comments, basically just loops through each comment and adds the data 
showComments = function(commentObjetcs){
    commentObjetcs.forEach(response => {
        addTestimonial({
            "username": response.username, 
            "comment": response.comment,
            "rating": response.rating,
            "lane": response.lane,
            "date": response.date});

    })
}


// This is the function for when we submit a new comment
document.getElementById("NewCommentSubmit").onclick = function(){
    const user = document.getElementById("IGN").value;
    const comment = document.getElementById("explination").value;
    const rating = document.getElementById("ratingStars").value * 2;
    const lane = document.getElementById("lane").value;

    let newObject = {
        "username": user,
        "comment": comment,
        "rating": Number(rating),
        "lane": lane,
        "date": getCurrentDateString()
    }

    pushReply(newObject)

    addTestimonial(newObject);;
}

// This function will push a reply to the JSON file on the server's side
pushReply = function(o){
    commentObjetcs.push(o);


    fetch("http://127.0.0.1:3000/send", {
        method: 'POST',
        body: JSON.stringify(commentObjetcs),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
    })
        .finally();
}

// This function will add a testimonial one at a time, this is useful for when we want to sort them!
addTestimonial = function(o){
    currentString = document.getElementById("responses").innerHTML;
    currentString = currentString + `<div class="container"> <img src="images/${o.lane}.png" alt="Avatar" style="width:90px"> <p><span>${o.username}</span> <span class="rating"> ${o.rating}/10</span></p> <p>${o.comment}</p> <p class=showingDate> ${o.date} </p></div>`
    document.getElementById("responses").innerHTML = currentString;
}


// If else tree to see what kind of sorting we need to do
sort = function(sortType){

    let sortedObjects;


    if(sortType == "lowHigh"){
        sortedObjects = commentObjetcs.sort(
            (p1, p2) => (p1.rating > p2.rating) ? 1: (p1.rating < p2.rating) ? -1 : 0)
    } else if (sortType == "highLow"){
        sortedObjects = commentObjetcs.sort(
            (p1, p2) => (p1.rating < p2.rating) ? 1: (p1.rating > p2.rating) ? -1 : 0)
    } else if(sortType == "dateRecent"){
        sortedObjects = commentObjetcs.sort(
            (p1, p2) => -sortDates(p1,p2)
        )
    } else if(sortType == "dateOld"){
        sortedObjects = commentObjetcs.sort(
            (p1, p2) => sortDates(p1, p2)
        )
    }

    return sortedObjects
}


//Helper function to sort dates specifically
sortDates = function(d1, d2){

    parts1 = d1.date.split("/");
    parts2 = d2.date.split("/");

    //Check year first
    if(Number(parts1[2]) > Number(parts2[2])){
        return 1;
    } else if(Number(parts1[2]) < Number(parts2[2])){
        return -1;
    } else{
        // Check the months
        if(Number(parts1[0]) > Number(parts2[0])){
            return 1;
        } else if(Number(parts1[0]) < Number(parts2[0])){
            return -1;
        } else{
            // check days
            if(Number(parts1[1]) > Number(parts2[1])){
                return 1;
            } else if(Number(parts1[1]) < Number(parts2[1])){
                return -1;
            } else return 0;
        }
    }


}




// Function for changing the order of the testimonials based on what the user chooses for the dropdown
document.getElementById("sorting").onchange = function(){

    sortedObjects = sort(document.getElementById("sorting").value)

    document.getElementById("responses").innerHTML = ""
    sortedObjects.forEach(response => addTestimonial(response))
}

