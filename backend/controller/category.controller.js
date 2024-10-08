import Category from '../model/category.model.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};
export const addCategory = async (req, res) => {
    const { name } = req.body;
 try {
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }  
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
      const newCategory = new Category({ name });
      await newCategory.save();
  
      res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
      res.status(500).json({ message: 'Error adding category', error });
    }
  };
  
  export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted successfully', category });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error });
    }
  };
