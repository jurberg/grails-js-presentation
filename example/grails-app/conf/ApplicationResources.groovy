modules = {

    application {
        dependsOn 'jquery'
        resource url: '/js/lib/underscore.js'
        resource url: '/js/lib/backbone.js'
        resource url: '/js/app/config.js'
        resource url: '/js/app/model/todo.js'
        resource url: '/js/app/collection/todo.js'
        resource url: '/js/app/view/todo.js'
        resource url: '/js/app/view/app.js'
        resource url: '/js/app/todos.js'
    }

}
