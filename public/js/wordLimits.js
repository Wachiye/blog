// checks if words in the input are within required length
document.onkeypress = () => {
    //get all inputs with word limits
    document.querySelectorAll('input[data-max-words]').forEach( input => {
        //get specific input word limit
        let wordLimit = parseInt(input.getAttribute('data-max-words'))
        //add event listener for each keydown
        input.addEventListener('keydown', function(e){
            let target = e.currentTarget
            //split the text in the input and get the number of words entered
            //this is like getting the number of items in an array
            let words = target.value.split(/\s+/).length
            //if words > limit, dont allow any extra characters
            if( words > wordLimit)
            {
                //allow deletions or backspace
                if( e.keyCode == 46 || e.keyCode == 8){
                    input.style.borderColor = ""
                }
                else{ // disallow other button
                   
                    input.style.borderColor = "red"
                    e.preventDefault()  
                }
            }
        })
    })

    //check for character limits
    document.querySelectorAll('input[maxlength]').forEach( input => {
        let charLimit = parseInt(input.getAttribute('maxlength'))
        input.addEventListener('keydown', (e) => {
            let target = e.currentTarget
            //get current characters
            let counts = target.value.length
            if(counts >= charLimit){
                input.style.borderColor = "red"
            }
            else{
                input.style.borderColor = ""
            }
        })
    })
}
