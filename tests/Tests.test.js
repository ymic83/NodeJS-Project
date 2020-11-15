//1.  Testing all registration data is filled it.

test('All registration data is filled out', () => {
    const user = {
        firstname: 'Joshua1',
        lastname: 'Moskovitz1',
        email: 'josh@gmail.com',
        password: 'Aa123456',
        confirm: 'Aa123456'
    }
    expect(user.firstname).not.toBe('');
    expect(user.lastname).not.toBe('');
    expect(user.email).not.toBe('');
    expect(user.password).not.toBe('');
    expect(user.confirm).not.toBe('');
})

//2.  Testing registration that first name has at least 2 letters

test('First name larger then 2 letters ', () => {
    const user = {
        firstname: 'Joshua'
    }
    const userfirstNameLength = user.firstname.length;
    expect(userfirstNameLength).toBeGreaterThanOrEqual(2);
})


//3.  Testing that the email contains proper values

test('All registration data is filled out', () => {
    const user = {
        email: 'joshua@gmail.com'
    }
    expect(user.email).toContain('@');
    expect(user.email).toContain('.com');
})


//4.  Testing that email length is long enough

test('Email length is long enough', () => {
    const user = {
        email: 'joshua@gmail.com'
    }
    const userEmailLength = user.email.length;
    expect(userEmailLength).toBeGreaterThanOrEqual(6);
})


//5.  Testing password has minumum length.

test('Password length is long enough', () => {
    const user = {
        password: 'Aa123456'
    }
    const userPasswordLength = user.password.length;
    expect(userPasswordLength).toBeGreaterThanOrEqual(8);
})



//6.  Testing password ontains both letters and numbers

test('Password contains numbers and letters', () => {
    const user = {
        password: 'Aa123456'
    }
    let lettercount = 0;
    let numbercount = 0;
    for (let i = 0; i < user.password.length; i++) {
        if (user.password[i].match(/[0-9]/)) {
            numbercount++
        } else if (user.password[i].match(/[a-zA-Z]/)) {
            lettercount++
        }
    }
    expect(lettercount).toBeGreaterThanOrEqual(1);
    expect(numbercount).toBeGreaterThanOrEqual(1);
})



//7.  Confirm password matches Password
test('confirm and password match', () => {
    const user = {
        password: 'Aa123456',
        confirm: 'Aa123456'
    }
    expect(user.password).toMatch(user.confirm);
})


//8. First name only contains letters.

test('First name only contains letters', () => {
    const user = {
        firstname: 'Joshua'
    }
    let nonlettercount = 0;
    for (let i = 0; i < user.firstname.length; i++) {
        if (user.firstname[i].match(/[^a-zA-Z]/)) {
            nonlettercount++
        }
    }
    expect(nonlettercount).toEqual(0);
})


//9. Last name only contains letters.

test('Last name only contains letters', () => {
    const user = {
        lastname: 'Moskovitz'
    }
    let nonlettercount = 0;
    for (let i = 0; i < user.lastname.length; i++) {
        if (user.lastname[i].match(/[^a-zA-Z]/)) {
            nonlettercount++
        }
    }
    expect(nonlettercount).toEqual(0);
})


//Login Tests


//10.  user email input matches DB data

test('user email input matches DB data', () => {
    const user = {
        email: 'joshua@gmail.com',
        DBemail: 'joshua@gmail.com'
    }
    expect(user.email).toMatch(user.DBemail);
})


//11.  User password input matches DB data

test('user password input matches DB data', () => {
    const user = {
        password: 'Aa123456',
        DBpassword: 'Aa123456'
    }
    expect(user.password).toMatch(user.DBpassword);
})



//12.  email or password not empty

test('All login data is filled out', () => {
    const user = {
        email: 'josh@gmail.com',
        password: 'Aa123456'
    }
    expect(user.email).not.toBe('');
    expect(user.password).not.toBe('');
})


//Movies Tests

//13.  Movie object length should be 3

test('Movie object length should be 3', () => {
    const movie = {
        Title: 'Jaws',
        ReleaseYear: 1974,
        Description: 'A share likes to eat people'
    }
    const movieLength = Object.keys(movie).length;
    expect(movieLength).toEqual(3);

})


//14.  Movie title should a string.

test('Movie title should a string', () => {
    const movie = {
        Title: 'Jaws'
    }
    expect(typeof movie.Title).toBe('string');
})

//15.  Movie year should be numeric.


test('Movie year should be numeric', () => {
    const movie = {
        ReleaseYear: 1978
    }
    expect(typeof movie.ReleaseYear).toBe('number');
})


//16.  Movie Description should be string.

test('Movie description should a string', () => {
    const movie = {
        Description: 'A share likes to eat people'
    }
    expect(typeof movie.Description).toBe('string');
})



//17.  movie array length no more then 10


test('movie array length no more then 10', () => {
    const movie = [{
        Title: 'Jaws',
        ReleaseYear: 1974,
        Description: 'A share likes to eat people'
    }, {
        Title: 'Avengers',
        ReleaseYear: 2012,
        Description: 'Superheroes save us'
    }, {
        Title: 'Batman',
        ReleaseYear: 1989,
        Description: 'The dark knight defends Gotham'
    }]
    const movieLength = movie.length;
    expect(movieLength).toBeLessThanOrEqual(10);

})


//Search

//18.  Single search result should contain specific letter.

test('Single search result should contain specific letter', () => {
    const movie = {
        Title: 'Jaws'
    }
    expect(movie.Title).toMatch('J');
})


//19.  Single search results should contain specific word

test('Single search results should contain specific word', () => {
    const movie = {
        Title: 'The Emprire Strikes Back'
    }
    expect(movie.Title).toMatch('Strikes');
})


//20.  Multiple search result should contain specific letter.

test('Multiple search result should contain specific letter', () => {
    const movie = [{
        Title: 'Jaws'
    }, {
        Title: 'Ghost Affair'
    }, {
        Title: 'Batman'
    }]
    for (let i = 0; i < movie.length; i++) {
        expect(movie[i].Title).toMatch('a');
    }

})


//21.  Multiple search results should contain specific word

test('Multiple search result should contain specific letter', () => {
    const movie = [{
        Title: 'The Avengers'
    }, {
        Title: 'The Avengers Age of Ultron'
    }, {
        Title: 'The Avengers Infinity Wars'
    }]
    for (let i = 0; i < movie.length; i++) {
        expect(movie[i].Title).toMatch('Avengers');
    }

})


//favorites


//22.  Array of movies should be longer then 1

test('Array of movies should be longer then 0', () => {
    const movie = [{
        Title: 'Jaws',
        ReleaseYear: 1974,
        Description: 'A share likes to eat people'
    }, {
        Title: 'Avengers',
        ReleaseYear: 2012,
        Description: 'Superheroes save us'
    }]
    const movieLength = movie.length;
    expect(movieLength).toBeGreaterThanOrEqual(1);

})


//23. Movie object length should be 3

test('Movie object length should be 3', () => {
    const movie = {
        Title: 'Avengers',
        ReleaseYear: 2012,
        Description: 'Superheroes save us'
    }
    const movieLength = Object.keys(movie).length;
    expect(movieLength).toEqual(3);

})