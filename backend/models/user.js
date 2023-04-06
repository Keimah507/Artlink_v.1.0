class User {
    constructor(name, email, bio) {
        this.name = name;
        this.email = email;
        this.bio = bio;
    }
    toString() {
        return this.name + ',' + this.email + ',' + this.bio;
    }

}