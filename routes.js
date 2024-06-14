const express = require('express');
const items = require("./fakeDb");
const ExpressError = require('./expressError');

const router = new express.Router();

// GET all items
router.get("/", (req, res, next) => {
    try {
        if (!items.length) throw new ExpressError("There are no items to see", 401);
        return res.json({ items });
    } catch (err) {
        next(err);
    }
});

// POST a new item
router.post("/", (req, res, next) => {
    try {
        const { name, price } = req.body;
        if (!name || !price) {
            throw new ExpressError("Missing data", 403);
        }
        const newItem = { name, price };
        items.push(newItem);
        return res.status(201).json({ added: newItem });
    } catch (err) {
        next(err);
    }
});

// GET an item by name
router.get("/:name", (req, res, next) => {
    try {
        const item = items.find(item => item.name === req.params.name);
        if (!item) throw new ExpressError("No item with that name in DB", 404);
        return res.json(item);
    } catch (err) {
        next(err);
    }
});

// PATCH an item by name
router.patch("/:name", (req, res, next) => {
    try {
        const { name, price } = req.body;
        const item = items.find(item => item.name === req.params.name);
        if (!item) throw new ExpressError("No item with that name in DB", 404);
        item.name = name || item.name;
        item.price = price || item.price;
        return res.status(200).json({ updated: { name: item.name, price: item.price } });
    } catch (err) {
        next(err);
    }
});

// DELETE an item by name
router.delete("/:name", (req, res, next) => {
    try {
        const itemIndex = items.findIndex(item => item.name === req.params.name);
        if (itemIndex === -1) throw new ExpressError("No item with that name in DB", 404);
        items.splice(itemIndex, 1);
        return res.json({ message: 'Deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;