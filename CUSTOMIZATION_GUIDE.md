# 🎨 Easy Customization Guide

## 📝 How to Change All Content

All titles, descriptions, and content are now centralized in **one single file** for easy editing:

### 📍 **Main Configuration File**
```
src/config/content.ts
```

## 🔧 **What You Can Customize**

### 1. **Product Family Information**
```typescript
productFamilies: {
  'ai-core': {
    name: 'AI-Core Platform',                    // ← Change product name
    description: 'Revolutionary AI platform...',  // ← Change short description  
    overviewDescription: 'The AI-Core Platform...' // ← Change detailed overview
  }
}
```

### 2. **Image Titles & Descriptions**
```typescript
images: {
  titles: [
    'Advanced System Architecture Overview',      // ← Change image titles
    'Real-time Performance Dashboard',
    // Add more titles...
  ],
  descriptions: [
    'Detailed visualization showcasing...',       // ← Change image descriptions
    'Interactive dashboard providing...',
    // Add more descriptions...
  ]
}
```

### 3. **Video Titles & Descriptions**
```typescript
videos: {
  titles: [
    'Complete System Demonstration',              // ← Change video titles
    'Advanced Feature Walkthrough',
    // Add more titles...
  ],
  descriptions: [
    'Comprehensive video demonstration...',       // ← Change video descriptions
    'In-depth walkthrough of advanced...',
    // Add more descriptions...
  ]
}
```

### 4. **Presentation & Document Descriptions**
```typescript
presentations: {
  descriptions: [
    'Comprehensive presentation covering...',     // ← Change presentation descriptions
    'Strategic overview presentation...',
    // Add more descriptions...
  ]
},
documents: {
  descriptions: [
    'Comprehensive technical documentation...',   // ← Change document descriptions
    'Strategic planning document...',
    // Add more descriptions...
  ]
}
```

### 5. **General Content**
```typescript
general: {
  contactMessage: 'Thank you for your interest...',     // ← Change contact message
  emailAddress: 'marketing-products@akkodis.com',       // ← Change email address
  noMediaMessage: 'Additional media content...',        // ← Change no media message
  loadingMessage: 'Loading comprehensive content...'    // ← Change loading message
}
```

## 🚀 **How It Works**

1. **Independent Content**: Each title and description is completely independent
2. **Automatic Cycling**: Content cycles through arrays, so you can have as many or as few as you want
3. **Instant Updates**: Changes appear immediately when you save the file
4. **Type Safety**: TypeScript ensures you don't break anything

## ✏️ **Quick Editing Steps**

1. **Open** `src/config/content.ts`
2. **Find** the section you want to change
3. **Edit** the text in quotes
4. **Save** the file
5. **Done!** Changes appear instantly

## 📋 **Examples**

### Change All Image Titles:
```typescript
titles: [
  'My Custom Image Title 1',
  'My Custom Image Title 2', 
  'My Custom Image Title 3',
  // Add as many as you want!
]
```

### Change Product Description:
```typescript
'ai-core': {
  name: 'My AI Platform',
  description: 'My custom description here...',
  overviewDescription: 'My detailed overview here...'
}
```

### Change Contact Info:
```typescript
general: {
  contactMessage: 'Contact us for more information!',
  emailAddress: 'contact@mycompany.com'
}
```

## 🎯 **Pro Tips**

- **Add More Content**: Just add more items to any array
- **Remove Content**: Delete items you don't need
- **Reorder Content**: Drag and drop to reorder
- **Copy & Paste**: Duplicate sections and modify them
- **Preview Changes**: Save and see changes instantly in the app

Everything is now **centralized** and **easy to customize**! 🎉