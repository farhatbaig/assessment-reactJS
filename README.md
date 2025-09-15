# Social Support Application

A modern, accessible, and multilingual social support application built with React, TypeScript, and Tailwind CSS. This application features a multi-step form wizard with AI-powered assistance for writing compelling application descriptions.

## 🚀 Features

### Core Functionality
- **Multi-step Form Wizard**: 3-step application process with progress tracking
- **Real-time Validation**: Comprehensive form validation with business rules
- **Data Persistence**: Automatic saving to localStorage with step restoration
- **AI-Powered Assistance**: OpenAI integration for writing assistance
- **Multilingual Support**: English and Arabic (RTL) language support
- **Responsive Design**: Mobile-first design with touch-friendly interactions

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **React Hook Form**: Efficient form handling with validation
- **Tailwind CSS**: Utility-first styling with custom components
- **React i18next**: Internationalization and localization
- **React Toastify**: Professional notification system
- **Accessibility**: WCAG 2.1 compliant with screen reader support

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Forms**: React Hook Form, Yup validation
- **State Management**: React Context API, useReducer
- **AI Integration**: OpenAI GPT-3.5-turbo API
- **Internationalization**: React i18next
- **Notifications**: React Toastify
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farhatbaig/assessment-reactJS.git
   cd social-support-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Add your OpenAI API key to the `.env` file:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── UI/              # Reusable UI components
│   ├── steps/           # Form step components
│   └── ...
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── services/            # API and external services
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── locales/             # Internationalization files
└── constants/           # Application constants
```

## 🎯 Key Components

### Form Wizard
- **ProgressStepper**: Visual progress indicator with clickable steps
- **PersonalInfoStep**: Personal information collection
- **FamilyFinancialStep**: Family and financial details
- **SituationDescriptionsStep**: Situation descriptions with AI assistance

### AI Integration
- **AIAssistanceDialog**: Modal for AI-powered writing assistance
- **aiService**: OpenAI API integration with retry logic and caching
- **useAIAssistance**: Custom hook for AI functionality

### State Management
- **FormContext**: Global form state management
- **useFormPersistence**: Automatic data persistence
- **useFormStep**: Form step management with validation

## 🔧 Configuration

### Environment Variables
- `VITE_OPENAI_API_KEY`: OpenAI API key for AI assistance

### Validation Rules
- **Personal Info**: Name (2-50 chars), National ID (13 digits), Age (18-120), etc.
- **Financial Info**: Income validation, dependent count limits
- **Descriptions**: Minimum 50 characters, maximum 1000 characters

### AI Service Configuration
- **Model**: GPT-3.5-turbo
- **Max Tokens**: 300
- **Temperature**: 0.7
- **Timeout**: 30 seconds
- **Retry Logic**: 3 attempts with exponential backoff


## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```



## ♿ Accessibility Features

- **Skip Navigation**: Skip to main content link
- **ARIA Labels**: Comprehensive ARIA labeling
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Optimized for screen readers
- **Focus Management**: Proper focus handling
- **Color Contrast**: WCAG AA compliant colors

## 🌐 Internationalization

### Supported Languages
- **English** (en): Default language
- **Arabic** (ar): Right-to-left (RTL) support

### Adding New Languages
1. Create translation files in `src/locales/[language]/`
2. Add language configuration in `src/utils/i18n.ts`
3. Update language switcher component

## 🔒 Security Features

- **Environment Variables**: Secure API key management with `.env` files
- **Input Validation**: Comprehensive client-side and server-side validation
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Same-origin policy compliance
- **Git Security**: `.env` files properly excluded from version control

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first approach
- **Touch Interactions**: Touch-friendly buttons and inputs
- **Viewport Optimization**: Proper viewport configuration
- **Performance**: Optimized for mobile networks

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow (#F59E0B)
- **Neutral**: Gray scale

### Typography
- **Font Family**: System fonts (Inter, system-ui)
- **Font Sizes**: Responsive scale (text-xs to text-4xl)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React Hook Form for efficient form handling
- React i18next for internationalization support