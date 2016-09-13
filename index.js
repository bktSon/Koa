const koa = require('koa');
const app = koa();
const route = require('koa-route');
const views = require('co-views');
const parse = require('co-body');

const render= views(__dirname + '/views', { map: { html: 'swig' }});
const todos = [];


app.use(route.get('/', list));
app.use(route.get('/todo/new', add));
app.use(route.get('/todo/:id', show));
app.use(route.get('/todo/delete/:id', remove));
app.use(route.get('/todo/edit/:id', edit));
app.use(route.post('/todo/create', create));
app.use(route.post('/todo/update', update));


function *list() {
    this.body = yield render('index', {todos : todos});
}

function *add() {
    this.body = yield render('new');
}

function *show(id) {
    const todo = todos[id];
    if( ! todo) {
        throw new Error('Todo id is not existed');
    }
    this.body = yield  render('show', {todo : todo});
}

function *create() {
    var todo = yield parse(this);
    todo.created_on = new Date;
    todo.updated_on = new Date;
    const id = todos.push(todo);
    todo.id = id - 1;
    console.log('toid is', todo.id);
    this.redirect('/');
    console.log('length of todos', todos.length);
    console.log(todos);
}

function *remove(id) {
    const todo = todos[id];
    if( ! todo) {
        throw  new Error('To do id is not existed to remove');
    }
    todos.splice(id, 1);
    for (var i = 0; i < todos.length; i++)
    {
        todos[i].id=i;
    }
    this.redirect('/');
}

function *edit(id) {
    const todo = todos[id];
    this.body = yield render('edit.html', {todo: todo});
}

function *update() {
    const todo = yield parse(this);
    // const index = todo.id;
    // console.log(index);
    todos[todo.id].name = todo.name;
    todos[todo.id].description = todo.description;
    todos[todo.id].updated_on  = new Date;
    this.redirect('/');
}

app.listen(3000);
console.log('App listen port 3000');

