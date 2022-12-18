const { text } = require("express");

// write tests here
describe("Quotes App", () => {
    beforeEach (() => {
        // Each test need fresh state
        // Test shouldn't rely on other tests. (They should be independent pieces)
        // Every test should work in isolation 
        // This enables the website to refresh after each test 
        cy.visit("http://localhost:1234"); //CAREFUL! Need to make sure tehe local host matches the one that's running
    })
// Helpers (ie Getters)
const textInput = () => cy.get("input[name=text]"); // Go to local host and inspect one of series of input => It shows input name = "text"
const authorInput = () => cy.get("input[name=author]"); //Similar to one aobove, inspect shows input name="author"
const foobarInput = () => cy.get("inputp[name=foobar]"); // This shouldn't exist in the DOM. Checking to ensure that it doesn't exist
const submitBtn = () => cy.get(`button[id="submitBtn"]`);
const cancleBtn = () => cy.get(`button[id="cancelBtn"]`);

it("sanity check to make sure test work", () =>{
    //"it" is a test 
    // "expect" is an assertion
    // There can be multiple assertion per test, but they all need to relate to the "one thing" that we are testing
    expect (1+2).to.equal(3);
    expect (2+2).not.equal(6); // strict === vs ==     === is strict, does NOT do type coercion (1 !=== "1") while (1 == "1")
    expect ({}).not.to.equal({}) // is this true? 
    // const person = {                 const person2 = {
    //  name: "Casey"                     name: "Casey"
    // }                                }
    // 0xh32 => person                  0xh33 => person2
    // In Java-Script, when you strictly compare two objects, it looks at the memory address 
    // Therefore, person !=== person2
    expect ({}).to.eql({});   // eql means ==   while equal means === 
})

it("the proper elements are showing", () => {
    textInput().should("exist");
    authorInput().should("exist");
    foobarInput().should("not.exist");
    submitBtn().should("exist");
    cancleBtn().should("exist");

    cy.contains("Submit Quote").should("exist");        // This is case sensitive
    cy.contains(/submit quote/i).should("exist");       // This coding makes it case insensitive 
})

describe("Filling out the inputs and cancelling",() =>{
    it("can navigate to the site", () => {
        cy.url().should("include", "localhost");
    })
    it("submit button starts out disabled",()=> {
        submitBtn().should("be.disabled");
    })
    it("can type in the inputs", ()=> {
        textInput()
        .should("have.value", "")
        .type("CSS rules")
        .should("have.value", "CSS rules");

        authorInput()
        .should("have.value","")
        .type("CRHarding")
        .should("have.value", "CRHarding");
    })

    it ("the submit button enables when both inputs are filled out", ()=>{
        authorInput().type("Casey");
        textInput().type("This is fun!");
        submitBtn().should("not.be.disabled");
    })

    it("the cancel button can reset the inputs and disable submit button", () => {
        authorInput().type("Casey");
        textInput().type("This is fun!");
        cancelBtn().click();
        textInput().should("have.value", "");
        authorInput().should("have.value", "");
        submitBtn().should("be.disabled");
    })
})

// CI/CD = Continuous Integration / Continuous Delivery 
// Testing is crucial in this. 
// When you push your code to production or to stage, if it doesn't pass the test, it doesn't push the code
// -> It pushes the code back to you and say the test failed 

    describe("Adding a new quote", ()=>{
        it("can submit and delete a new quote", ()=> {
            textInput().type("CSS rules");
            authorInput().type("CRHarding");
            submitBtn().click();
            // It's important that the state is the same at the beginning of each test!
            // We need to ensure that we are immediately deleting the new post.
            // Whenever we create something in the database, we are also deleting something
            cy.contains("CSS rules").siblings("button:nth-of-type(2)").click();
            cy.contains("CSS rules").should("not.exist");
        })

        // There's another way of doing this
        it("variation of can submit a new quote", () => {
            cy.contains("CSS rules").should("not.exist");
            textInput().type("CSS rules");
            authorInput().type("Casey");
            submitBtn().click();
            cy.contains("CSS rules");
            cy.contains("Casey");
            cy.contains("CSS rules").next().next().click();
            cy.contains("CSS rules").should("not.exist");
        })
    })

    describe("Editing an existing quote", () => {
        it("can edit a quote", ()=>{
            textInput().type("Lorem ipsum");
            authorInput().type("CRHarding");
            submitBtn().click();
            cy.contains("Lorem ipsum").siblings("button:nth-of-type(1)").click();
            textInput().should("have.value", "Lorem ipsum");
            authorInput().should("have.value", "CRHarding");
            textInput().type(" dolor sit");
            authorInput().type(" Rocks");
            submitBtn().click();
            cy.contains("Lorem ipsum dolor sit(CRHarding Rocks)");
            // gotta hit that delete button!
            cy.contains("Lorem ipsum dolor sit(CRHarding Rocks)").next().next().click();
            cy.contains("Lorem ipsum dolor sit(CRHarding Rocks)").should("not.exist");
        })
    })
})