const mongoose = require('mongoose');
require('dotenv').config();
const { User, Skill, Progress, Quiz, Circle, Post, Book } = require('./models/Schemas');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const uriFile = path.join(__dirname, '../MONGO_URI.txt');
let MONGODB_URI;

if (fs.existsSync(uriFile)) {
    MONGODB_URI = fs.readFileSync(uriFile, 'utf8').trim();
} else {
    MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alme_db';
}

const seedData = async (isAuto = false) => {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(MONGODB_URI);
        }

        await User.deleteMany({});
        await Skill.deleteMany({});
        await Progress.deleteMany({});
        await Quiz.deleteMany({});
        await Circle.deleteMany({});

        const html = await Skill.create({ name: 'HTML Basics', category: 'Frontend', difficulty: 2 });
        const css = await Skill.create({ name: 'CSS Fundamentals', category: 'Frontend', difficulty: 3, dependencies: [html._id] });
        const js = await Skill.create({ name: 'JavaScript Core', category: 'Language', difficulty: 5, dependencies: [css._id] });
        const react = await Skill.create({ name: 'React Development', category: 'Framework', difficulty: 7, dependencies: [js._id] });
        const node = await Skill.create({ name: 'Node.js Backend', category: 'Backend', difficulty: 8, dependencies: [js._id] });

        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            name: 'Aryan Sharma',
            email: 'aryan@example.com',
            password: hashedPassword,
            role: 'student',
            skillLevel: 'Intermediate'
        });

        const quizData = [
            // --- FRONTEND ---
            {
                title: 'HTML Mastery Quiz', category: 'Frontend', difficulty: 'easy', skill: html,
                questions: [
                    { questionText: 'Which tag is used to define an unordered list?', options: ['<ol>', '<ul>', '<li>', '<list>'], correctOption: 1, difficulty: 1 },
                    { questionText: 'What is the purpose of the <head> tag?', options: ['Main content', 'Metadata and title', 'Footer links', 'Sidebars'], correctOption: 1, difficulty: 2 },
                    { questionText: 'How do you create an input field for passwords?', options: ['<input type="text">', '<input type="pass">', '<input type="password">', '<input type="field">'], correctOption: 2, difficulty: 2 },
                    { questionText: 'What does the href attribute specify in an anchor tag?', options: ['Text color', 'Image source', 'Target URL', 'Font style'], correctOption: 2, difficulty: 1 },
                    { questionText: 'Which tag is used for the smallest heading?', options: ['<h1>', '<h6>', '<header>', '<hsmall>'], correctOption: 1, difficulty: 1 }
                ]
            },
            {
                title: 'CSS Flexbox Essentials', category: 'Frontend', difficulty: 'medium', skill: css,
                questions: [
                    { questionText: 'Which property defines the main axis direction?', options: ['justify-content', 'flex-direction', 'align-items', 'flex-wrap'], correctOption: 1, difficulty: 2 },
                    { questionText: 'How do you center items along the cross axis?', options: ['justify-content: center', 'text-align: center', 'align-items: center', 'flex-center: true'], correctOption: 2, difficulty: 3 },
                    { questionText: 'What is the default value of flex-direction?', options: ['column', 'row', 'row-reverse', 'initial'], correctOption: 1, difficulty: 2 },
                    { questionText: 'Which property allows a flex item to grow?', options: ['flex-shrink', 'flex-basis', 'flex-grow', 'flex-expand'], correctOption: 2, difficulty: 3 },
                    { questionText: 'What value of display enables flexbox?', options: ['block', 'inline', 'flex', 'grid'], correctOption: 2, difficulty: 1 }
                ]
            },
            {
                title: 'CSS Grid Layouts', category: 'Frontend', difficulty: 'hard', skill: css,
                questions: [
                    { questionText: 'How do you create a 3-column grid with equal width?', options: ['grid-template-columns: 1fr 1fr 1fr', 'grid-cols: 3', 'grid-width: 33%', 'display: column-3'], correctOption: 0, difficulty: 4 },
                    { questionText: 'What does the fr unit represent?', options: ['Fixed Ratio', 'Fractional unit', 'Font Relative', 'Frame Rate'], correctOption: 1, difficulty: 3 },
                    { questionText: 'How do you span an item across 2 rows?', options: ['row-span: 2', 'grid-row: span 2', 'grid-height: 2', 'span-row: 2'], correctOption: 1, difficulty: 5 },
                    { questionText: 'Which property creates space between grid cells?', options: ['margin', 'padding', 'gap', 'spacing'], correctOption: 2, difficulty: 2 },
                    { questionText: 'Can an element be both a flex container and a grid item?', options: ['Yes', 'No', 'Only in Chrome', 'Only in Safari'], correctOption: 0, difficulty: 4 }
                ]
            },
            {
                title: 'Responsive Design Basics', category: 'Frontend', difficulty: 'medium', skill: css,
                questions: [
                    { questionText: 'Which meta tag is crucial for responsive design?', options: ['viewport', 'charset', 'description', 'keywords'], correctOption: 0, difficulty: 2 },
                    { questionText: 'What is a "mobile-first" approach?', options: ['Coding for desktops first', 'Coding for mobile first and adding media queries', 'Buying a phone', 'Designing only for iOS'], correctOption: 1, difficulty: 3 },
                    { questionText: 'What does @media (max-width: 600px) target?', options: ['Screens larger than 600px', 'Screens exactly 600px', 'Screens 600px or smaller', 'Images only'], correctOption: 2, difficulty: 2 },
                    { questionText: 'Which unit is relative to the viewport width?', options: ['px', 'em', 'vw', 'rem'], correctOption: 2, difficulty: 3 },
                    { questionText: 'What is the purpose of a breakpoint?', options: ['To stop the code', 'To change layout at specific screen sizes', 'To debug CSS', 'To slow down rendering'], correctOption: 1, difficulty: 2 }
                ]
            },
            {
                title: 'Modern HTML5 APIs', category: 'Frontend', difficulty: 'hard', skill: html,
                questions: [
                    { questionText: 'Which API allows offline storage in the browser?', options: ['WebSQL', 'LocalStorage', 'IndexedDB', 'CookieAPI'], correctOption: 2, difficulty: 4 },
                    { questionText: 'What is the purpose of the Geolocation API?', options: ['To track files', 'To get user location', 'To draw maps', 'To calculate distances'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Which tag is used for drawing graphics via JS?', options: ['<graphics>', '<svg>', '<canvas>', '<draw>'], correctOption: 2, difficulty: 4 },
                    { questionText: 'What is a Web Worker?', options: ['A remote employee', 'A script that runs in the background', 'A browser plugin', 'A CSS debugger'], correctOption: 1, difficulty: 5 },
                    { questionText: 'The <video> tag supports which attribute for auto-starting?', options: ['start', 'play', 'autoplay', 'loop'], correctOption: 2, difficulty: 2 }
                ]
            },

            // --- BACKEND ---
            {
                title: 'Node.js Core Concepts', category: 'Backend', difficulty: 'medium', skill: node,
                questions: [
                    { questionText: 'What engine does Node.js use?', options: ['SpiderMonkey', 'V8', 'Nitro', 'Chakra'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Is Node.js multi-threaded by default?', options: ['Yes', 'No', 'Only for CPU tasks', 'Only on Linux'], correctOption: 1, difficulty: 4 },
                    { questionText: 'What is the purpose of "npm"?', options: ['Node Package Monitor', 'Node Package Manager', 'Network Protocol Module', 'None'], correctOption: 1, difficulty: 1 },
                    { questionText: 'Which module is used for handling file paths?', options: ['fs', 'url', 'path', 'os'], correctOption: 2, difficulty: 2 },
                    { questionText: 'What does "REPL" stand for?', options: ['Read-Eval-Print-Loop', 'Run-Execute-Process-Link', 'Render-Engine-Process-Library', 'None'], correctOption: 0, difficulty: 4 }
                ]
            },
            {
                title: 'Express.js Routing', category: 'Backend', difficulty: 'easy', skill: node,
                questions: [
                    { questionText: 'How do you define a GET route in Express?', options: ['app.post()', 'app.get()', 'app.route("GET")', 'app.fetch()'], correctOption: 1, difficulty: 1 },
                    { questionText: 'Which object represents the outgoing data?', options: ['req', 'res', 'next', 'data'], correctOption: 1, difficulty: 2 },
                    { questionText: 'What is req.params used for?', options: ['Query strings', 'URL parameters', 'Request body', 'Headers'], correctOption: 1, difficulty: 3 },
                    { questionText: 'How do you send a JSON response?', options: ['res.sendJSON()', 'res.json()', 'res.writeJSON()', 'res.end()'], correctOption: 1, difficulty: 2 },
                    { questionText: 'What does app.use() do?', options: ['Starts the server', 'Adds middleware', 'Connects to DB', 'Defines a model'], correctOption: 1, difficulty: 3 }
                ]
            },
            {
                title: 'REST API Design', category: 'Backend', difficulty: 'hard', skill: node,
                questions: [
                    { questionText: 'Which HTTP method is idempotent?', options: ['POST', 'PUT', 'PATCH', 'None'], correctOption: 1, difficulty: 5 },
                    { questionText: 'What does 404 status code mean?', options: ['Server Error', 'Forbidden', 'Not Found', 'Created'], correctOption: 2, difficulty: 1 },
                    { questionText: 'What is HATEOAS?', options: ['A security protocol', 'A database type', 'Hypermedia as the Engine of Application State', 'None'], correctOption: 2, difficulty: 5 },
                    { questionText: 'Which status code is used for "Unauthorized"?', options: ['401', '403', '400', '404'], correctOption: 0, difficulty: 3 },
                    { questionText: 'JWT consists of header, payload, and...?', options: ['Data', 'Footprint', 'Signature', 'Key'], correctOption: 2, difficulty: 4 }
                ]
            },
            {
                title: 'Backend Security', category: 'Backend', difficulty: 'hard', skill: node,
                questions: [
                    { questionText: 'What is CSRF?', options: ['Cross-Site Request Forgery', 'Client-Side Routing Format', 'Core Server Resource Filter', 'None'], correctOption: 0, difficulty: 4 },
                    { questionText: 'How should you store passwords?', options: ['Plain text', 'Base64', 'Hashed with Salt (e.g. Bcrypt)', 'Encrypted with RSA'], correctOption: 2, difficulty: 3 },
                    { questionText: 'What is SQL Injection?', options: ['Updating DB fast', 'Malicious SQL code in inputs', 'A type of join', 'Deleting the DB'], correctOption: 1, difficulty: 4 },
                    { questionText: 'What is Cors?', options: ['Cross-Origin Resource Sharing', 'Core Operating Resource System', 'Client Only Request Security', 'None'], correctOption: 0, difficulty: 3 },
                    { questionText: 'Why use environment variables?', options: ['To speed up code', 'To hide secrets like API keys', 'To organize files', 'To make code readable'], correctOption: 1, difficulty: 2 }
                ]
            },
            {
                title: 'Middleware Mastery', category: 'Backend', difficulty: 'medium', skill: node,
                questions: [
                    { questionText: 'What is the third argument in Express middleware?', options: ['req', 'res', 'next', 'err'], correctOption: 2, difficulty: 3 },
                    { questionText: 'Can middleware modify the request object?', options: ['Yes', 'No', 'Only in Express 5', 'Only on Sundays'], correctOption: 0, difficulty: 3 },
                    { questionText: 'Which middleware is used to parse JSON body?', options: ['express.json()', 'body-parser', 'json.parse()', 'Both A and B'], correctOption: 3, difficulty: 4 },
                    { questionText: 'How do you handle errors in Express?', options: ['try/catch only', 'Error-handling middleware with 4 args', 'res.error()', 'app.on("error")'], correctOption: 1, difficulty: 4 },
                    { questionText: 'What happens if you forget to call next()?', options: ['Response is sent', 'Request hangs', 'Server restarts', 'Error is thrown'], correctOption: 1, difficulty: 3 }
                ]
            },

            // --- DATABASE ---
            {
                title: 'MongoDB Basics', category: 'Database', difficulty: 'easy', skill: node,
                questions: [
                    { questionText: 'What format does MongoDB use to store data?', options: ['XML', 'BSON', 'SQL', 'CSV'], correctOption: 1, difficulty: 2 },
                    { questionText: 'What is the equivalent of a row in MongoDB?', options: ['Collection', 'Field', 'Document', 'Table'], correctOption: 2, difficulty: 1 },
                    { questionText: 'How do you uniquely identify a document?', options: ['_id', 'id', 'uuid', 'key'], correctOption: 0, difficulty: 1 },
                    { questionText: 'Which command finds all documents in a collection?', options: ['db.col.search({})', 'db.col.find({})', 'db.col.get()', 'db.col.select()'], correctOption: 1, difficulty: 2 },
                    { questionText: 'Is MongoDB a relational database?', options: ['Yes', 'No', 'Sometimes', 'Unknown'], correctOption: 1, difficulty: 1 }
                ]
            },
            {
                title: 'SQL Fundamentals', category: 'Database', difficulty: 'medium', skill: node,
                questions: [
                    { questionText: 'Which clause is used to filter results?', options: ['GROUP BY', 'WHERE', 'ORDER BY', 'HAVING'], correctOption: 1, difficulty: 2 },
                    { questionText: 'What does JOIN do?', options: ['Deletes data', 'Combines rows from multiple tables', 'Sorts results', 'Creates a table'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Primary Key must be...?', options: ['Unique', 'Non-null', 'Both A and B', 'A string'], correctOption: 2, difficulty: 3 },
                    { questionText: 'Which SQL statement updates data?', options: ['MODIFY', 'CHANGE', 'UPDATE', 'REFRESH'], correctOption: 2, difficulty: 1 },
                    { questionText: 'What does ACID stand for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Information, Data', 'Always, Correct, Integrated, Detailed', 'None'], correctOption: 0, difficulty: 5 }
                ]
            },
            {
                title: 'Advanced Aggregations', category: 'Database', difficulty: 'hard', skill: node,
                questions: [
                    { questionText: 'Which MongoDB stage is used for filtering?', options: ['$match', '$filter', '$find', '$where'], correctOption: 0, difficulty: 4 },
                    { questionText: 'How do you join collections in MongoDB?', options: ['$join', '$lookup', '$merge', '$link'], correctOption: 1, difficulty: 5 },
                    { questionText: 'What does $group do?', options: ['Sorts data', 'Deletes data', 'Aggregates data into categories', 'Filters data'], correctOption: 2, difficulty: 4 },
                    { questionText: 'Which stage projects specific fields?', options: ['$select', '$pick', '$project', '$fields'], correctOption: 2, difficulty: 3 },
                    { questionText: 'The aggregate method takes an array of...?', options: ['Strings', 'Booleans', 'Stages (Objects)', 'Functions'], correctOption: 2, difficulty: 3 }
                ]
            },
            {
                title: 'Database Indexing', category: 'Database', difficulty: 'hard', skill: node,
                questions: [
                    { questionText: 'Why use indexes?', options: ['To save space', 'To speed up queries', 'To encrypt data', 'To make files larger'], correctOption: 1, difficulty: 3 },
                    { questionText: 'What is a "Compound Index"?', options: ['Index on one field', 'Index on multiple fields', 'Two different indexes', 'None'], correctOption: 1, difficulty: 4 },
                    { questionText: 'Does indexing slow down writes?', options: ['Yes', 'No', 'Only for strings', 'Only on Mondays'], correctOption: 0, difficulty: 5 },
                    { questionText: 'What is "Index Scan"?', options: ['Reading the whole table', 'Searching via index', 'Scanning for viruses', 'None'], correctOption: 1, difficulty: 4 },
                    { questionText: 'Which command shows query performance?', options: ['explain()', 'check()', 'perf()', 'run()'], correctOption: 0, difficulty: 4 }
                ]
            },
            {
                title: 'Redis & Caching', category: 'Database', difficulty: 'medium', skill: node,
                questions: [
                    { questionText: 'Is Redis an in-memory database?', options: ['Yes', 'No', 'Only for cache', 'Unknown'], correctOption: 0, difficulty: 2 },
                    { questionText: 'Redis stores data as?', options: ['Tables', 'Key-Value pairs', 'XML', 'Binary only'], correctOption: 1, difficulty: 2 },
                    { questionText: 'What is TTL in caching?', options: ['Total Time Left', 'Time To Live', 'Table Task List', 'None'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Can Redis persist data to disk?', options: ['Yes', 'No', 'Only with a plugin', 'Only on Linux'], correctOption: 0, difficulty: 5 },
                    { questionText: 'Which data structure does Redis NOT support?', options: ['Strings', 'Lists', 'SQL Tables', 'Sets'], correctOption: 2, difficulty: 4 }
                ]
            },

            // --- LANGUAGE ---
            {
                title: 'JS Scope & Closures', category: 'Language', difficulty: 'medium', skill: js,
                questions: [
                    { questionText: 'What is Lexical Scope?', options: ['Scope based on location in source code', 'Scope based on execution time', 'Global scope only', 'None'], correctOption: 0, difficulty: 4 },
                    { questionText: 'Function inside a function having access to outer vars is called?', options: ['Loop', 'Recursion', 'Closure', 'Callback'], correctOption: 2, difficulty: 3 },
                    { questionText: 'Variable declared with let has?', options: ['Block scope', 'Function scope', 'Global scope', 'No scope'], correctOption: 0, difficulty: 2 },
                    { questionText: 'What is the Global execution context?', options: ['The base context', 'The last context', 'A local context', 'None'], correctOption: 0, difficulty: 4 },
                    { questionText: 'Can closures cause memory leaks?', options: ['Yes', 'No', 'Only in IE', 'Only in older JS versions'], correctOption: 0, difficulty: 5 }
                ]
            },
            {
                title: 'Asynchronous JS', category: 'Language', difficulty: 'hard', skill: js,
                questions: [
                    { questionText: 'What does "await" do?', options: ['Stops the computer', 'Pauses execution until promise resolves', 'Crashes the browser', 'Nothing'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Which state is NOT a Promise state?', options: ['Pending', 'Fulfilled', 'Rejected', 'Waiting'], correctOption: 3, difficulty: 2 },
                    { questionText: 'What is the Event Loop?', options: ['A rendering engine', 'Logic that handles async tasks', 'A type of loop like for', 'None'], correctOption: 1, difficulty: 5 },
                    { questionText: 'Which microtask has higher priority?', options: ['setTimeout', 'Promise.then', 'setInterval', 'onClick'], correctOption: 1, difficulty: 5 },
                    { questionText: 'Promise.all resolves when?', options: ['One promise resolves', 'All promises resolve', 'First promise rejects', 'Never'], correctOption: 1, difficulty: 4 }
                ]
            },
            {
                title: 'ES6+ Features', category: 'Language', difficulty: 'easy', skill: js,
                questions: [
                    { questionText: 'How do you create a constant?', options: ['var', 'let', 'const', 'permanent'], correctOption: 2, difficulty: 1 },
                    { questionText: 'What is template literal syntax?', options: ['""', "''", '``', '[]'], correctOption: 2, difficulty: 2 },
                    { questionText: 'What does destructuring do?', options: ['Deletes an object', 'Unpacks values into variables', 'Sorts an array', 'Encodes a string'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Syntax for an arrow function?', options: ['function() => {}', '() => {}', '=> () {}', 'func => {}'], correctOption: 1, difficulty: 2 },
                    { questionText: 'What is the "SpreadOperator"?', options: ['...', '***', '---', '&&&'], correctOption: 0, difficulty: 3 }
                ]
            },
            {
                title: 'JS Prototype Chain', category: 'Language', difficulty: 'hard', skill: js,
                questions: [
                    { questionText: 'What is __proto__?', options: ['The prototype of a function', 'A link to the prototype object', 'A hidden variable', 'None'], correctOption: 1, difficulty: 5 },
                    { questionText: 'Where do most objects inherit from?', options: ['Function.prototype', 'Object.prototype', 'Array.prototype', 'None'], correctOption: 1, difficulty: 4 },
                    { questionText: 'Does JS have real classes?', options: ['Yes, since ES6', 'No, they are sugar for prototypes', 'Only in TypeScript', 'None'], correctOption: 1, difficulty: 5 },
                    { questionText: 'How to check object own properties?', options: ['hasOwnProperty()', 'isOwn()', 'check()', 'keyCheck()'], correctOption: 0, difficulty: 3 },
                    { questionText: 'Shadowing happens when?', options: ['Outer var hides inner var', 'Inner var hides outer var', 'Variable is null', 'None'], correctOption: 1, difficulty: 4 }
                ]
            },
            {
                title: 'Higher Order Functions', category: 'Language', difficulty: 'medium', skill: js,
                questions: [
                    { questionText: 'What is a Higher Order Function?', options: ['Function that returns a number', 'Function that takes or returns functions', 'Self-executing function', 'Global function'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Which is a HOF?', options: ['map()', 'filter()', 'reduce()', 'All of the above'], correctOption: 3, difficulty: 2 },
                    { questionText: 'Is a callback always async?', options: ['Yes', 'No', 'Only in Node', 'Only in Browsers'], correctOption: 1, difficulty: 4 },
                    { questionText: 'What does map() return?', options: ['Boolean', 'A new array', 'Same array modified', 'Original array length'], correctOption: 1, difficulty: 2 },
                    { questionText: 'Purpose of reduce()?', options: ['Deletes items', 'Calculates a single value from array', 'Splits array', 'None'], correctOption: 1, difficulty: 4 }
                ]
            },

            // --- FRAMEWORK ---
            {
                title: 'React Fundamentals', category: 'Framework', difficulty: 'easy', skill: react,
                questions: [
                    { questionText: 'What is JSX?', options: ['A new language', 'Syntax sugar for React.createElement', 'A database format', 'None'], correctOption: 1, difficulty: 2 },
                    { questionText: 'How do you create a React app?', options: ['npm start react', 'npx create-react-app', 'npm install react-app', 'setup-react'], correctOption: 1, difficulty: 1 },
                    { questionText: 'What are components?', options: ['CSS files', 'Reusable UI pieces', 'Database tables', 'Browser plugins'], correctOption: 1, difficulty: 1 },
                    { questionText: 'Can components return multiple elements?', options: ['No, only one', 'Yes, inside a Fragment or parent', 'Only in React 18', 'None'], correctOption: 1, difficulty: 3 },
                    { questionText: 'What is "props"?', options: ['Proper Styles', 'Properties passed to components', 'Private State', 'None'], correctOption: 1, difficulty: 1 }
                ]
            },
            {
                title: 'React Hooks Deep Dive', category: 'Framework', difficulty: 'medium', skill: react,
                questions: [
                    { questionText: 'Hook for state management?', options: ['useEffect', 'useState', 'useRef', 'useContext'], correctOption: 1, difficulty: 1 },
                    { questionText: 'When does useEffect run?', options: ['Only once', 'On every render by default', 'Depends on dependency array', 'Both B and C'], correctOption: 3, difficulty: 3 },
                    { questionText: 'Purpose of useRef?', options: ['To focus DOM elements', 'To store mutable values without re-rendering', 'Both A and B', 'To handle API calls'], correctOption: 2, difficulty: 4 },
                    { questionText: 'Hook for performance optimization?', options: ['useMemo', 'useCallback', 'Both A and B', 'useFetch'], correctOption: 2, difficulty: 4 },
                    { questionText: 'Rules of Hooks?', options: ['Call at top level only', 'Call inside loops', 'Call in nested functions', 'None'], correctOption: 0, difficulty: 1 }
                ]
            },
            {
                title: 'Component Lifecycle', category: 'Framework', difficulty: 'hard', skill: react,
                questions: [
                    { questionText: 'Functional cleanup is done via...?', options: ['return func in useEffect', 'componentWillUnmount', 'useEffectCleanup', 'None'], correctOption: 0, difficulty: 4 },
                    { questionText: 'Equivalent of componentDidMount in hooks?', options: ['useEffect(() => {}, [])', 'useEffect(() => {})', 'useOnMount', 'None'], correctOption: 0, difficulty: 3 },
                    { questionText: 'Why use keys in lists?', options: ['To style them', 'To help React identify changes efficiently', 'To sort the list', 'None'], correctOption: 1, difficulty: 4 },
                    { questionText: 'What is the "Reconciliation" process?', options: ['Updating DB', 'Diffing virtual DOM with real DOM', 'Compiling JSX', 'None'], correctOption: 1, difficulty: 5 },
                    { questionText: 'Can a hook be called conditionally?', options: ['Yes', 'No', 'Only inside if statements', 'Only in dev mode'], correctOption: 1, difficulty: 5 }
                ]
            },
            {
                title: 'React State Management', category: 'Framework', difficulty: 'medium', skill: react,
                questions: [
                    { questionText: 'What is "Prop Drilling"?', options: ['A good practice', 'Passing props through unnecessary layers', 'A CSS technique', 'None'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Redux follows which pattern?', options: ['MVC', 'Flux/Unidirectional Data Flow', 'Pub/Sub only', 'None'], correctOption: 1, difficulty: 5 },
                    { questionText: 'What is Context API?', options: ['A database', 'Built-in way to share global state', 'A routing library', 'None'], correctOption: 1, difficulty: 3 },
                    { questionText: 'Which hook provides context?', options: ['useContext', 'useState', 'useGlobal', 'useStore'], correctOption: 0, difficulty: 2 },
                    { questionText: 'Is state update in React synchronous?', options: ['Yes', 'No (Batched)', 'Only in classes', 'Always'], correctOption: 1, difficulty: 4 }
                ]
            },
            {
                title: 'Advanced React Patterns', category: 'Framework', difficulty: 'hard', skill: react,
                questions: [
                    { questionText: 'What is an HOC?', options: ['High-Output Component', 'Higher-Order Component', 'Hidden Object Controller', 'None'], correctOption: 1, difficulty: 5 },
                    { questionText: 'What are "Render Props"?', options: ['Props that render HTML', 'A technique for sharing code via a prop function', 'CSS properties', 'None'], correctOption: 1, difficulty: 5 },
                    { questionText: 'What does React.memo() do?', options: ['Stores images', 'Memoizes components to skip re-renders', 'Handles state', 'None'], correctOption: 1, difficulty: 4 },
                    { questionText: 'Feature for code splitting in React?', options: ['React.lazy() and Suspense', 'React.chunk', 'Import-React', 'None'], correctOption: 0, difficulty: 5 },
                    { questionText: 'What is a "Controlled Component"?', options: ['Component with its own state', 'Component whose value is driven by React state', 'Unstyled component', 'None'], correctOption: 1, difficulty: 3 }
                ]
            }
        ];

        for (const q of quizData) {
            await Quiz.create({
                title: q.title,
                relatedSkill: q.skill._id,
                category: q.category,
                difficulty: q.difficulty,
                points: q.difficulty === 'hard' ? 400 : q.difficulty === 'medium' ? 200 : 100,
                duration: '15 min',
                questions: q.questions
            });
        }

        await Progress.create([
            { user: user._id, skill: html._id, masteryPercentage: 100, status: 'completed' },
            { user: user._id, skill: css._id, masteryPercentage: 85, status: 'completed' },
            { user: user._id, skill: js._id, masteryPercentage: 45, status: 'in-progress' },
            { user: user._id, skill: react._id, masteryPercentage: 0, status: 'locked' },
            { user: user._id, skill: node._id, masteryPercentage: 0, status: 'locked' }
        ]);

        await Circle.insertMany([
            { name: "JS Logic Masters", members: 154, icon: "Users", description: "Deep dive into JS engines and logic." },
            { name: "Neural Network Hub", members: 82, icon: "ShieldCheck", description: "AI and machine learning discussions." },
            { name: "Full Stack Squad", members: 210, icon: "Users", description: "End-to-end web architecture." },
            { name: "Cyber Guardians", members: 45, icon: "ShieldCheck", description: "Security protocols and hacking defense." },
            { name: "Python Wizards", members: 120, icon: "Users", description: "Automation and data science with Python." },
            { name: "React Pro Group", members: 305, icon: "BrainCircuit", description: "Advanced React patterns and performance." }
        ]);

        const { Book } = require('./models/Schemas');
        await Book.deleteMany({});
        await Book.insertMany([
            {
                title: "Eloquent JavaScript",
                author: "Marijn Haverbeke",
                category: "Programming",
                rating: 4.8,
                pages: 472,
                description: "A modern introduction to programming, JavaScript, and the wonders of the digital. This book dives deep into the language, from basic syntax to advanced functional programming.",
                image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60",
                content: "JavaScript is a versatile language that powers the web. It started as a simple scripting tool but has grown into a powerhouse for both frontend and backend development. In this book, we explore the core principles of the language..."
            },
            {
                title: "Cracking the Coding Interview",
                author: "Gayle Laakmann McDowell",
                category: "Career",
                rating: 4.9,
                pages: 687,
                description: "The most popular book for preparing for technical interviews. It contains 189 programming questions and solutions, from binary trees to scaling systems.",
                image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&auto=format&fit=crop&q=60",
                content: "Technical interviews are about more than just coding; they're about problem-solving and communication. A candidate must demonstrate the ability to think through complex problems under pressure..."
            },
            {
                title: "You Don't Know JS Yet",
                author: "Kyle Simpson",
                category: "Programming",
                rating: 4.7,
                pages: 250,
                description: "A series of books diving into the core mechanisms of the JavaScript language. This edition focuses on 'Get Started' and the basic building blocks.",
                image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=60",
                content: "Most developers learn enough JS to get by, but few truly understand how the engine works. This book challenges your assumptions and forces you to think deep about scope, closures, and prototypes..."
            },
            {
                title: "Clean Code",
                author: "Robert C. Martin",
                category: "Best Practices",
                rating: 4.8,
                pages: 464,
                description: "A handbook of agile software craftsmanship. Learn how to write code that is easy to read, maintain, and refactor by following time-tested principles.",
                image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60",
                content: "Writing code is easy; writing clean code is hard. Clean code looks like well-written prose. It never obscures the designer's intent, but rather is filled with crisp abstractions..."
            },
            {
                title: "Understanding Machine Learning",
                author: "Shai Shalev-Shwartz",
                category: "AI/ML",
                rating: 4.6,
                pages: 440,
                description: "Provides a theoretical foundation for machine learning. Covers everything from the PAC learning model to neural networks and deep learning.",
                image: "https://images.unsplash.com/photo-1488229297570-58520851e868?w=800&auto=format&fit=crop&q=60",
                content: "Machine learning is the study of algorithms that improve through experience. At its heart, it's about finding patterns in data and using those patterns to make predictions about the future..."
            },
            {
                title: "Fullstack React",
                author: "Anthony Accomazzo",
                category: "Development",
                rating: 4.7,
                pages: 825,
                description: "The complete guide to React and Friends. Learn how to build production-ready applications with React, Redux, GraphQL, and more.",
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
                content: "React has revolutionized the way we build user interfaces. By using a declarative approach and a virtual DOM, it allows developers to build fast, responsive, and maintainable applications..."
            },
            {
                title: "The Pragmatic Programmer",
                author: "Andrew Hunt",
                category: "Philosophy",
                rating: 4.9,
                pages: 352,
                description: "A masterpiece that cuts through the increasing specialization and technicalities of modern software development to examine the core process.",
                image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60",
                content: "A pragmatic programmer takes charge of their own career. They aren't afraid to admit ignorance, and they are constantly looking for ways to improve their craft. Tools come and go, but the principles of good software remain..."
            }
        ]);

        await Post.deleteMany({});
        await Post.insertMany([
            { user: "Aryan Sharma", role: "Student", content: "Just finished the React Development module! The project-based learning really helps.", likes: 12, comments: 2, topic: "Development", color: "#61DBFB" },
            { user: "Aesha Patel", role: "Admin", content: "Welcome to the new ALME platform! Feel free to explore the library and join study circles.", likes: 25, comments: 5, topic: "Announcement", color: "#FF4D4D" },
            { user: "Rahul Verma", role: "Student", content: "Does anyone want to team up for the 'JS Logic Masters' circle challenges?", likes: 8, comments: 10, topic: "Collaboration", color: "#F7DF1E" }
        ]);

        console.log('🚀 Seeding complete with 5 high-quality questions per quiz!');
        if (!isAuto) process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        if (!isAuto) process.exit(1);
    }
};

if (require.main === module) {
    seedData();
}

module.exports = { seedData };
