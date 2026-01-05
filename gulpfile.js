const { src, dest } = require('gulp');

function buildIcons() {
	return src(['nodes/**/*.svg', 'nodes/**/*.jpg', 'nodes/**/*.png']).pipe(dest('dist/nodes'));
}

exports['build:icons'] = buildIcons;
