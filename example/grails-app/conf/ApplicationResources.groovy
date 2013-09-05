modules = {
    application {}
    backbone {
        resource url: '/js/lib/underscore.js'
        resource url: '/js/lib/backbone.js'
    }
    todo {
        dependsOn 'jquery, backbone'
        resource url: '/css/todos.css'
        resource url: '/js/todos.js'
    }
}
