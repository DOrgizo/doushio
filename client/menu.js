
(function () {

$DOC.on('click', '.control', function (event) {
	var $target = $(event.target);
	if ($target.is('li')) {
		var handler = menuHandlers[$target.text()];
		if (handler) {
			var $post = parent_post($target);
			var model = parent_model($target);
			handler(model, $post);
		}
	}
	var $menu = $(this).find('ul');
	if ($menu.length)
		$menu.remove();
	else {
		$menu = $('<ul/>', {"class": 'popup-menu'});
		var opts = menuOptions.slice();

		var model = parent_model($target);
		if (!model) {
			var op = postForm && postForm.model.get('op');
			if (postForm && !postForm.committed() && (!op || $('#'+op).is('.floop')))
				opts = ['Flip'];
			else
				opts = ['Focus'];
		}

		oneeSama.trigger('menuOptions', {options: opts, model: model});

		opts.forEach(function (opt) {
			$('<li/>').text(opt).appendTo($menu);
		});
		$menu.appendTo(this);
	}
});

$DOC.on('mouseleave', '.popup-menu', function (event) {
	var $ul = $(this);
	if (!$ul.is('ul'))
		return;
	event.stopPropagation();
	var timer = setTimeout(function () {
		/* Using $.proxy() here breaks FF? */
		$ul.remove();
	}, 300);
	/* TODO: Store in view instead */
	$ul.data('closetimer', timer);
});

$DOC.on('mouseenter', '.popup-menu', function (event) {
	var $ul = $(this);
	var timer = $ul.data('closetimer');
	if (timer) {
		clearTimeout(timer);
		$ul.removeData('closetimer');
	}
});

oneeSama.hook('headerFinish', function (info) {
	info.header.unshift(safe('<span class="control"/>'));
});

oneeSama.hook('draft', function ($post) {
	$post.find('header').prepend('<span class=control/>');
});

$('<span class=control/>').prependTo('header');

$('#persona').click(function (e) {
	e.preventDefault();
	var $fs = $('fieldset');
	$fs.css('visibility', $fs.css('visibility') == 'hidden' ? 'visible' : 'hidden');
});

})();
