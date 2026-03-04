const itemModel = require('../models/itemModel');

// GET all items
exports.getAllItems = async (req, res, next) => {
    try {
        const items = await itemModel.getAllItems();
        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        next(error);
    }
};

// GET single item
exports.getItem = async (req, res, next) => {
    try {
        const item = await itemModel.getItemById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// POST create item
exports.createItem = async (req, res, next) => {
    try {
        console.log('Received form data:', JSON.stringify(req.body, null, 2));
        const { 
            title, 
            description, 
            category,
            location,
            contact_email,
            contact_phone,
            status 
        } = req.body;
        
        // Validate required fields
        if (!title || !description || !category || !location) {
            console.log('Missing fields:', { title, description, category, location });
            return res.status(400).json({
                success: false,
                message: 'Missing required fields. Please provide: title, description, category, location'
            });
        }
        
        // Validate category
        if (!['Lost', 'Found'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Category must be either Lost or Found'
            });
        }
        
        // Ensure at least one contact method
        if (!contact_email && !contact_phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one contact method (email or phone)'
            });
        }

        console.log('Validation passed, calling model...');
        
        const id = await itemModel.createItem({ 
            title, 
            description, 
            category,
            location,
            contact_email,
            contact_phone,
            status: status || 'Active'
        });

        console.log('Created item with ID:', id);
        
        const newItem = await itemModel.getItemById(id);
        
        res.status(201).json({
            success: true,
            data: newItem
        });
    } catch (error) {
        next(error);
    }
};

// PUT update item
exports.updateItem = async (req, res, next) => {
    try {
        // If contact info is being updated, validate at least one exists
        if (req.body.contact_email !== undefined || req.body.contact_phone !== undefined) {
            const currentItem = await itemModel.getItemById(req.params.id);
            if (!currentItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Item not found'
                });
            }
            
            const newEmail = req.body.contact_email !== undefined ? req.body.contact_email : currentItem.contact_email;
            const newPhone = req.body.contact_phone !== undefined ? req.body.contact_phone : currentItem.contact_phone;
            
            if (!newEmail && !newPhone) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one contact method must be provided'
                });
            }
        }
        
        const updated = await itemModel.updateItem(req.params.id, req.body);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Item not found or no changes made'
            });
        }
        
        const item = await itemModel.getItemById(req.params.id);
        
        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// PATCH update item status (quick status update)
exports.updateItemStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        if (!status || !['Active', 'Claimed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid status (Active or Claimed)'
            });
        }
        
        const updated = await itemModel.updateItem(req.params.id, { status });
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        const item = await itemModel.getItemById(req.params.id);
        
        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// DELETE item
exports.deleteItem = async (req, res, next) => {
    try {
        const deleted = await itemModel.deleteItem(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// GET items by category
exports.getItemsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        
        if (!['Lost', 'Found'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Category must be either Lost or Found'
            });
        }
        
        const items = await itemModel.getAllItems({ category });
        
        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        next(error);
    }
};

// GET statistics
exports.getStats = async (req, res, next) => {
    try {
        const stats = await itemModel.getStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};