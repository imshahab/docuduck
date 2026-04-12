0. easiest way to run a server: npx serve

1. hydration:
   Hydration in frontend development is the process of synchronizing the server-rendered HTML with the client-side JavaScript framework. When a web page is server-rendered, the server sends HTML to the browser. The browser can display this HTML immediately, making the page appear faster. However, this HTML doesn’t have the interactive features that a JavaScript framework like React, Vue, or Angular provides.

Hydration allows the client-side JavaScript to “take over” the server-rendered HTML. It works by:

Server-Side Rendering (SSR): The server generates the HTML for the page, including the initial content and structure.
Client-Side JavaScript: The browser receives the HTML and also downloads the JavaScript bundle for the framework.
Re-hydration: Once the JavaScript is loaded and parsed, it traverses the DOM (Document Object Model) created by the server. It then attaches event listeners, sets up component states, and makes the HTML fully interactive, as if it were rendered entirely on the client.
Why is it important?

Performance: SSR with hydration provides the best of both worlds: fast initial load times (perceived performance) because the user sees content quickly, and a rich, interactive user experience once the JavaScript loads.
SEO: Search engines can more easily crawl and index content that is present in the initial HTML sent from the server.

2. transpilation:
   Transpilation is a form of code conversion that translates source code written in one programming language into another programming language. It’s similar to compilation, but instead of translating code into machine code that a computer’s processor can directly execute, transpilation converts code from one high-level language to another high-level language.

Think of it like this:

Compilation: Translates a human-readable language (like C++) into machine code (like assembly).
Transpilation: Translates a modern, high-level language (like modern JavaScript with JSX) into an older, more widely supported version of the same language (like older JavaScript that browsers understand natively).
Why do we need transpilation?

Browser Compatibility: Not all browsers support the latest features of a programming language. Transpilers allow developers to use modern syntax and features, and then convert that code into a version that older browsers can understand and run.
Language Extensions/Syntactic Sugar: Languages often evolve, and developers create extensions or new syntax (like JSX) that make writing code easier, more readable, or more powerful. Transpilers convert these extensions into standard language constructs.
Tooling and Frameworks: Many modern JavaScript frameworks and libraries (like React, Vue, Angular) rely on specific syntax or patterns that aren’t native to JavaScript. Transpilers are essential for converting these framework-specific syntaxes into standard JavaScript.
A very common example in JavaScript is using Babel. Babel is a JavaScript transpiler that takes modern JavaScript (ES6+) code, and JSX, and converts it into older JavaScript (ES5) that is compatible with a wider range of browsers.

3. As an example, this JSX code:

```JSX
const greeting = <p>Hello, world!</p>;
```

gets transpiled into something like this JavaScript code:

```Javascript
const greeting = React.createElement('p', null, 'Hello, world!');
```

What does this React.createElement call mean?

The React.createElement() function typically takes three main arguments:

type: This is a string representing the HTML tag name (like 'p', 'div', 'h1'), or a reference to a React component (like MyComponent).
props: This is an object containing any attributes or properties you pass to the element. In the JSX example, there were no attributes, so it’s null. If you had written <p className="greeting">, the props object would be { className: 'greeting' }.
children: This can be a string, another React element, or an array of React elements, representing the content inside the element. Here, it’s the string 'Hello, world!'.

4. JSX = JS XML lol:)

5. for prettier formatting:
   create a file named ".prettierrc"
   and just put an empty object in the file:) so that it uses all the defaults
   and then add prettier as a dev dependency to the project, using this command:
   `npm install --save-dev prettier` or `npm install -D prettier`
   also in package.json, in the scripts object, add the command "format", with the bash command
   `prettier --write \"src/**/*.{js,jsx,ts,tsx,css,html}\"`
   and then you can run `npm run format`

6. why dev dependency?
   it's going to be installed only on dev enivronments, and not production.

7. Linting:
   Linting is a process in software development that helps you automatically detect and flag stylistic errors, potential bugs, and suspicious constructs in your code. Think of it as a sophisticated spell-checker and grammar checker, but for your programming code.

8. all in all, we're gonna leave formatting to prettier, and linting to eslint!

9. to install eslint, run
   ``npm install -D eslint eslint-config-prettier eslint-plugin-react globals`
   (the eslint-config-prettier is just to make sure that prettier and eslint work together harmoniously without getting into each other's way)
   (we need the globals package to make sure eslint recognizes certain DOM globals)

then, we're gonna need an "esling.config.mjs" (m for module, we wanna use esmodules, otherwise it's gonna assume it's commonjs (does it?)) file. (or .js)
inside we do:

```javascript
import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";

export default [ // checks configurations from top to the bottom of the array, the lower the config, the last it is executed
	js.configs.recommends, //  a small subset of non-controversial eslint
	rules, you could use "all"
	{
		...reactPlugin.configs.flat.recommended, // new style of configs for eslint 9 are called flat! flat configs.
		settings: {
			react: {
				version: "detect", //eslint needs to know your react version and this way it can look at package.json find it itself
			}
		}
	},
	reactPlugin.configs.flat["jsx-runtime"], // fixes the error where it complains about not importing React in components
	{
		files: ["**/*.js", "**/*.jsx"],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }, // so that eslint recognizes some global variables like window or document, and doesn't complain about those
			parserOptions: {
				ecmaFeatures: {
					jsx: true, // without this jsx still will be linted, but eslint is not going to know how React is working (like how it's importing stuff)
				}
			}
		}
		rules: {
			// there are two annoying default react settings which we're gonna turn off
			"react/no-unescaped": "off", // with this on you'll have to use &apos in your strings instead of ''
			"react/prop-types": "off", // typescript dude!
		},
	},
	prettier,    // always put prettier last, because all it does is turning off formatting (doesn't add anything), (like don't check formatting, don't check new lines stuff, etc) so that it doesn't interfere with eslint
]
```

and then add `"lint": "eslint"` to the project scripts.
now you can run `npm run lint`

to fix issues, run `npm run lint -- --fix` (equivalent to running `eslint --fix`)
to debug run `npm run lint -- --debug`

you can install the eslint vscode extension too!

10. the two main reasons we add the "lint" and "format" commands are:
    A. to be able to use them in CI/CD, like a github action. if failed, do not deploy
    B. If someone doesn't have them installed (less important, people usually do lol!)

11. vite is not a bundler, it actually is a wrapper around RollUp.
    to install vite `npm install -D vite @vitejs/plugin-react`
    (make sure to add `type="module"` to all script tags in html to let vite know you're working with modules)
    then in `vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
});
```

fairly straightforward, we just need to tell vite that this is a react project

then:
add these scripts to package.json
`json
	"build": "vite build", // building for production, run usually on github actions as an example
	"dev": "vite", // local dev environment
	"preview": "vite preview" // builds for production, and serves it on local as if it's a production box, to help find bugs that appear only in production
	`

and at last add `"type": "module"` to the same file

12. to install react: `npm install react react-dom/client`. we don't install it as a dev dependency
    then `import React from 'react'` and `import { createRoot } from "react-dom";` to `App.js`

13. default export vs named export:
    ......
    you can have them together too!

14. Try and stick to one component per file, with export defaults

15. It makes sense to bundle the component jsx file and its css files, in addition to its tests all in a folder, so that whenever needed you can easily erase all of the components trace from the project

16. in jsx, when you use `{}` like in:
    `<sometag>{js expression}</sometag>`

a JS expression goes into the curly braces.
but what is an expression?
basically anything that can go to the right of a `=`!
like `props.name`

17. some jsx gotchas:
    A. for html tags, use `className` instead of `class`
    B. for self closing tags, always use `/` at the end, like <input />
    C. for `label`, use `htmlFor` instead of `for`
    D. Custom component names always start with capital
    E. a component can only return one single tag

18. you can just skip importing React to components, since the tools now take care of that automatically

19. to run both the backend and the frontend on the same port (so we don't have to deal with CORS, why?), add this to vite.config.js:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	server: {
		proxy: {
			"/api": {
				// proxy any calls to the /api endpoint on localhost:5173 to the target url, which could be anything (localhost or remote)
				target: "http://localhost:3000",
				changeOrigin: true,
			},
			"/public": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	plugins: [react()],
});
```

so now when you enter `localhost:5173/api/pizza` goes to port 3000, like `localhost:3000/api/pizza`

20. named function vs arrow function

21. when you do named functions for components, a minor plus is that the function name shows up in the stack trace

22. hooks are a way to add interactivity or side effects to a react component
23. side effects?
24. in components, the function body is a really hot path (it runs a lot), due to rerendering (react rerenders it whenever necessary), basically it runs more than you see, therefore you'd better keep it really performant

25. having vars outside of the react component and changing them inside the component is a bad idea, and things must stay self-contained????

26. two-way binding variables is not free in React!
    it's actually better, because when maintaining code it can turn into black magic, like where did the variable change lol.
27. react is less fun to write, but more fun to maintain. you don't wanna optimize the writing phase, you wanna do it in the maintaining phase.
28. anything with "use" in react is a hook!

29. we can never have hooks in conditionals or loops, because they depend on running in a specific order, and conditionals break that.
    so they must always be top level, even if we're not using them.
    in other words, hooks rely on strict ordering

30. useState() just returns an array of two elements! meaning this would work too:

    ```JSX
    const pizzaHook = useState("pepperoni)
    const pizzaType = pizzaHook[0]
    const setPizzaType pizzaHook[1]
    ```

    but it's just cleaner to do: `[pizzaType, setPizzaType]`

31. generally it's better not to use an event listener on a div, because screen readers can't recognize divs, the recognize inputs and stuff, so instead of:

    ```JSX
    <diiv onChange={(e) => setPizzaState(e.targer.value)}>
    	<iinput />
    </diiv>
    ```

    you'd better do:

    ```JSX
    <diiv >
    	<iinput onChange={(e) => setPizzaState(e.targer.value)} />
    </diiv>
    ```

32. so to sum up hooks till now, `useState` is the most common hook we'll use. and we used it to make form inputs interactive, or let's say made them react.
    basically we made our component stateful.
    what do we mean by state? things that can frequently change in your component let's say.
    this frequently gets tied to forms.

33. effects are usually used with states.
34. effect stands for side effect. frequently tied to an api request. basically anything that's gonna be inputting a component from outside, which is not user input, like an api or say Datetime, etc.
35. so basically useEffect is for anything you wanna do outside of a render. imagine:

    ```JSX
    const Pizza = (props) => {
    	.
    	.
    	.
    	fetchPizzaTypes()   // this is basically ddosing yourself. because it's gonna run every time this thing is rendered

    	return <someTag />

    }
    ```

    that's where useEffect saves the day

    ```JSX
    const Pizza = (props) => {
    	.
    	.
    	.
    	useEffect(() => {
    		fetchPizzaTypes();
    	}. [])   // the empty is to make sure it only runs once. without it, it's gonna schedule an effect after every single render. if you don't include this, it's gonna be the same ddosing thing*

    	return <someTag />

    }
    ```

    - if we put a variable in the array, like `[pizzaType]`, it means:
      whenever `pizzaType` is different from the previous render, do it again~
      so we leave it empty, meaning well, don't monitor any vars, do it only once!

36. you can use useState for loading indicators too.

37. why wouldn't we make the function fed into useEffect async????
    basically we make the original `fetchPizzaTypes` async instead, because async returns promises, and return types matter in useEffect????
    so you don't do:

    ```JSX
    useEffect(async() => {})
    ```

    MUST RESEARCH!

38. to run a function at the end in useEffect, like a cleanup function:

    ```JSX
    useEffect(() => {
    	return () => clearTimeout(timeout)
    })
    ```

39. in the top, fetchPizzaTypes() is the effect function
40. in react, we use our state vars optimistically, without any conditionals or stuff we just render `pizzaTypes`, assuming that eventually it's gonne be fed some data from the fetch function

41. currency internatinalization is just built into the browser now! no libraries needed.

42. a custom hook is just a function that calls other hooks

43. `key` attribute in `<option></option>`, why do we need it? at certain times the organization of the elements becomes important to us, and so we're gonna need a key value tied the item (something other than index) that helps identify it. you could use index though, when organization isn't necessary. that's why the linter complains about the key.

44. on the extreme side of stuff, we could just put all the effects in a custom hook and not have any effects in components. this makes testing hooks way easier.

45. renders finish first before the effects run

46. a general rule of thumb: if inside the effect we refer to some state, that state usually goes in the second attribute array (dependencies) too. like here, notice the state `pizzaTypes`

    ```JSX
      useEffect(() => {
    fetchPizzaTypes(pizzaTypes);
    	}, [pizzaTypes]);
    ```

47. statements vs expressions
48. if using webpack, make sure to NODE_ENV=development or production to not end up like slack:)
49. strict mode: just an extra set of checks for development (stuff that are gonna be deprecated or double rendering stuff, or running effects twice, etc)
50. in React, it's better to try to solve the problems you have and not worry about performance, and only introduce performance solutions when a problem arises, since 1. react is fast enough already 2. the solutions usually make the code harder to read and debug
51. useDebugValue: to display a label for custom hooks in react dev tools. it will appear in the hooks section of the react devtools.
    a really niche use case for useDebugValue is for custom hooks identifying them at a glance

52. you can add an onlclick handler to the submit btn instead of using preventDefault, but what if the user hits enter

53. feel free to just replace reduces and maps with simple loops. it can make the code more readable actually

54. we can use index as key in the cart, since items are not guranteed unique!

55. fairly frequently we pass down functions from parent to child component.

56. instead if `props` in a component function, you can use a destructured object, like `{ prop1, prop2 }`

57. one-way data flow in react: data only flows down in components. it never flows up!
    the only way to edit something, say a state in a parent, from a child, is throught passing a function to the child as a prop.
    in other words, a component can only modify its own states. they are self-encapsulated. which makes debugging very easy. a problem in component x, then we're 99 percent sure the problem is within the components codebase

58. context makes maintenance of the code very difficult, so try to use it only where necessary.
    the idea is basically being able to throw data into a portal, and recieve it elsewhere, as opposed to props, where it's only parent to child.

59. context can help with the prop drilling problem (like having five components passing data from parent to child)
60. unless you're using that state in multiple different places, just deal with prop drilling

61. some use cases are: user info, cart, theme

62. you could do `<CartContext>` instead of `<CartContextProvider>` in React 19
63. facebook phantom notifications
64. if you don't use the set function, you could do: `const [cart] = useContext(CartContext)`, so that it only pulls the state variable
65. the bad thing about contexts is that they don't make it immediately apparent what is modifying them (see video 24). and that's why in terms of clean code they suck.

66. although generated files usually don't get pushed to github, routeTree.gen.ts must be pushed

67. we're making a spa, and the `/routes/__root.jsx` file is the code that all the pages share together

68. in js functions return only one thing, and the component function are the same too. so they can only return one tag. to group multiple ones use `<></>`. it just wraps the stuff in an array.

69. lazy loading is bascially loading the component only when needed. otherwise everything will always be loaded. which can be costy for bigger projects

70. don't edit routeTree.gen.ts. it gets overwritten

71. always try and use the Link component from `@tansstack/react-router` instead of the `<a>` tag

72. command click on an object to go to typescript types. it can help find out what's happening sometimes

73. tanstack query => kinda the better alternative to useEffect especially for caching. to the point you can almost always use this instead of useEffect

74. a good pattern for api calls would be to make a route like `/src/api/` and put all the api calls as functions inside. this works well with tanstack query

75. tanstack query works kinda like redis, as in it checks the query key (which is an array) and if it's cached, the cache is back, if not, the queryFn is used to retrieve it, or if the cache is stale, it's re retrieved.

76. setting the stale time (the time it takes for the cache to go expired) is a challenge, and is usually solved with trial and error

77. it's safe to say tanstack query could be used almost everywhere instead of useEffect, as it's more elegant.

but effect has its own place too, like interacting with localStorage or firing up analytics in a component

78. for smaller apps, no need for state management libs, but for a big complicated app like figma. where so much data is shared across multiple different people, the something like zustand would be good

79. no reason to put useQuery in a custom hook (at least not when you have only one request), as no testing is required for a library (it must already be tested), and also it doesn't make the code any more clear

80. portals could be used for something like a side nav that changes content based on the context (the page we're on)

81. anytime you interact with the dom, like with document.getElementById, you're going through the slow code path. that's why we use a ref, which is a frozen object, and has one thing you can modify: current. it's a pointer that points to the one same thing.

82. in this code:

```JSX
  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    modalRoot.appendChild(elRef.current);
    return () => modalRoot.removeChild(elRef.current);
  }, []);
```

the last line (return ...) is the cleanup function. it rus whenever the component is unmounted, so that we don't leak memory.

83. `props.children` is anything that goes inside the tag.

84. with `return () => createPortal(<div>{children}</div>, elRef.current)`:
    In plain words:

You’re returning a small component that, when used, will mount its children inside a DOM element referenced by elRef.current—not inside the usual parent component structure.

85. to turn anything into boolean, you can use `!!`, like `!!var`

86. you can use something like sentry or trackjs to log your errors. (to be researched)

87. one of the few use cases of class components is ErrorBoundary

88. lifecycle methods and how useEffect replaces them...

89. arrow function vs function declaration context different (one being lexical blah blah)...

90. we can't pu `<ErrorBoundary>` inside of the component function, because if the component blows up, the whole thing will blow up, including the ErrorBoundary

91. you could wrap everything in \_root in ErrorBoundary too if you want to. an advantage would be it could catch 404s there!

92. try to throw an error in your post request so that tanstack query can handle it for you

93. in tanstack: query => when you get something from the api
    mutation: when something changes on the server-side, like a put, patch, post etc

94. we usually use uncontrolled form unless some of the inputs needs to be reactive.like setting the animal type in one input, and then the breed input being repopulated. (research double dropdown problem)

95. even for validation, it's better to use unctonrolled forms, and validate on submit, to not bother the user while entering data

96. you can do both uncontrolled and controlled too, in the same form

97. unlike useQuery where the function would be called automatically you have to invoke the mutation function youreself (obviously lol)

98. when you call `mutation.mutate ` it's gonna run some machinery before calling the function

99. a good place to write a test is when someone gives you a bug to fix. you can write a test that would've caught that. and when you write your code and it passes, you know you fixed the bug, and you have a test too

100.    brian wants tests to fail fast, fail loudly, and he wants to be testing something important! if not all three, skips the test.

101.    deleting test must be something you do regularly.

102.    vites => testing suite, tesitng-library/react => bunch of tools helping you to write test, happy-dom => synthetic browser environment

103.    **test** this is a magical name lol, coming from python. meaning the name is important for the lib, don't change it

104.    you can have a vite config exclusive to testing in `vitest.config.js`

105.    make sure to put some string in test() that makes you sure which test failed

106.    methods on ``screen` object are really user centric, as opposed to classes and ids which are developer centric

107.    when tests pass the very first time, you probably messed something up

108.    screen is stateful, meaning stuff from the former tests can remain. don't forget to reset it using `afterEach(cleanup)` or `cleanup()` in each test.

109.    spying in testing: im gonna create a fake version and later ask if this got called, and if so what functions did this get called with. this is called spying in testing, and vi is our spy.

110.    you CAN'T render a hook outside of a component
111.    `waitFor` in vitest, run the function inside continually until it no longer gets an error. basically wait for a while and run it again and again until the test inside (in vid 40 the `expect` function) passes.

forgot. Mocking: most of the time, mocking in React tests refers to API calls or data‑fetching logic.

112.    it's foolish to try and get 100% test coverage on your codebase, since you'll end up testing stuff that are not important.

113.    but the easiest way to do it: snapshot testing. it is low confidence and low effort.

quickie. just to make sure you know:

```JSX
const user = {
  name: "Alex",
  age: 25,
}

const { name, age } = user

console.log(name) // "Alex"
console.log(age)  // 25
```

this is object destructuring

114.    the base case for snapshot testing is a dumb component, without much logic. since all it does is that it renders a component and then tracks it to stay the same.
        generally, this kind of testing is very ui focused, and contains no logc, but it can help you with coverage.

115.    you can use `matchInlineSnapshot` to populate the snapshot inside the same file instead of a separate file for snapshots

116.    it's not the most compelling thing to use snapshot testing with components, but a good use case could be for api formatters. basically you use js objects instead of react components, and make sure that the frontend and the backend have the same contract of the api.

117.    coverage: what files/lines are tested what files/lines are not

118.    the difference with browser based tests (like with playwright) is that it's truly async, becasue it's actually waiting for the dom to render to be able to pick something

119.    some people put one suspense for the entire app, like this is the loading for all the app. not the most user friendly thing, but you could do it
        a localized version for each component would be a better idea though
120.    tanstack query supports Suspense

121.    in react 19 instead of something like `useContext()` you could use simply `use()`

122.    for optimization, you can use `useMemo` and `useCallback`, but as we said before, wait for performance problems to arise, and then go for them
        react compiler can do the optimizations for you though lol

123.    Sarah Vieira on twitter wants to bring back stupid
124.    you can use Neon for deploying dbs like a sqlite, or something like Turso, which does sqlite in cloud
125.    Elastic Beanstalk
