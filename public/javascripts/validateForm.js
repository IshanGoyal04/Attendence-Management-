//Copy and Pasted from bootsrap->content->form->validation
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    bsCustomFileInput.init()
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('validated-form'); // validated-form is my form class 
    // Loop over them and prevent submission
    Array.from(forms) // newer way of converting form into array
        .forEach(function (form) { // we are looping over each form
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });

})();