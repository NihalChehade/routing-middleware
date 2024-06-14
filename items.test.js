process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");

let items = require("./fakeDb");
const Test = require("supertest/lib/test");

let yogurt = {
    name: "Yogurt",
    price: 2.55
}

beforeEach(function(){
    items.push(yogurt);
});

afterEach(function(){
    items.length = 0;
});

describe("GET /items", () => {
    test("get all items", async () => {
      const res =  await request(app).get("/items");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({items: [yogurt]});
    });
})

describe("POST /items", () =>{
    test("Create an item", async () => {
        const res = await request(app).post("/items").send({name: "Fish", price : 6.99 })
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({added:{name: "Fish", price : 6.99 }})
    } )
})
describe("GET /items/:name", () => {
    test("get item by name", async () => {
      const res =  await request(app).get("/items/Yogurt");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(yogurt);
    });
    test("get item by invalid name", async () => {
        const res =  await request(app).get("/items/humus");
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ 
            error : { message: "No item with that name in DB", status: 404}
        });
      });
})

describe("PATCH /items/:name", () => {
    test("Update an item name and/or price", async () => {
        const res = await request(app).patch(`/items/${yogurt.name}`).send({name: "sweet Yogurt", price : 3.99});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({updated: {name: "sweet Yogurt", price : 3.99}});
    })
    test("for invalid name", async () =>{
        const res = await request(app).patch("/items/cucumber").send({name: "sweet Yogurt", price : 3.99});
        console.log(res.body)
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ 
            error : { message: "No item with that name in DB", status: 404}
        })
    })
})

describe("Delete /items/:name", () => {
    test("Delete an item by name ", async () => {
        const res = await request(app).delete(`/items/${yogurt.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' });
    })
    test("Delete an item by invalid name", async () =>{
        const res = await request(app).delete("/items/cucumber");
        
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ 
            error : { message: "No item with that name in DB", status: 404}
        })
    })
})