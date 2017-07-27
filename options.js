'use strict';

var $name = document.querySelector('#name');

document.addEventListener('DOMContentLoaded', () => {
	chrome.storage.sync.get(
		{name: ''},

		(items) => {
			$name.value = items.name;
		}
	);
});

document.querySelector('#save').addEventListener('click', () => {
	if ($name.value.trim().length > 0) {
		chrome.storage.sync.set(
			{name: $name.value},

			() => {
				close();
			}
		);
	}
});