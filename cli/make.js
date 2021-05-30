const fs = require('fs')
const type = process.argv[2]
const name = process.argv[3]

if (!type) {
    throw 'Missing type.'
}

if (!name) {
    throw 'Missing name.'
}

function makeCommand(name) {
    let dest = './commands/' + name + '.js'

    // Copy the file
    fs.copyFileSync('./examples/ExampleCommand.js', dest)

    // Replace content
    fs.readFile(dest, 'utf8', (err, data) => {
        if (err) console.error(err)

        let replacedString = data
            .replace(/example/g, name) // replace command name

        fs.writeFileSync(dest, replacedString)
    })
}

function makeFunction(name) {
    let dest = './functions/' + name + '.js'

    // Copy the file
    fs.copyFileSync('./examples/ExampleFunction.js', dest)

    // Replace content
    fs.readFile(dest, 'utf8', (err, data) => {
        if (err) console.error(err)

        let replacedString = data
            .replace(/exampleFunction/g, name) // replace function name

        fs.writeFileSync(dest, replacedString)
    })
}

function makeMiddleware(name) {
    let dest = './middlewares/' + name + '.js'

    // Copy the file
    fs.copyFileSync('./examples/ExampleMiddleware.js', dest)
}

switch (type) {
    case 'command':
        makeCommand(name)
        break

    case 'function':
        makeFunction(name)
        break

    case 'middleware':
        makeMiddleware(name)
        break

    default:
        throw 'Unknown type.'
}