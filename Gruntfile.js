module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            console: {
                src: ["src/front/console_core.js", "src/front/module/**/*.js"],
                dest: "dist/console_front.js"
            }
        },
        uglify: {
            console: {
                files: {
                    "dist/console_front.min.js": ["dist/console_front.js"],
                    "dist/console_bootstrap.min.js": ["src/bootstrap/console_bootstrap.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["concat:console", "uglify:console"]);
};
