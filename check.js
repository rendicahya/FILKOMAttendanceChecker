'use strict';

var name;
var xhr = new XMLHttpRequest;

document.addEventListener('DOMContentLoaded', () => {
	chrome.storage.sync.get(
		{name: ''},

		(items) => {
			name = items.name;

			if (!name) {
				chrome.runtime.openOptionsPage();
			} else {
				check();
			}
		}
	);
});

chrome.notifications.onButtonClicked.addListener(
	(notificationId, buttonIndex) => {
		chrome.notifications.clear('filkom_attendance_checker');

		switch (buttonIndex) {
			case 0:
				window.open('http://filkom.ub.ac.id/info/hadir');
				break;
		}
	}
);

var check = () => {
	let day = new Date().getDay();

	if (day === 0 || day === 6) {
		chrome.browserAction.setIcon({path: 'ice.png'});
		setTimeout(check, 10 * 60 * 1000);

		return;
	}

	let random = Math.random();

	xhr.open('GET', `http://repo.ptiik.ub.ac.id/hadir.php?name=${name}&r=${random}`, true);

	xhr.onreadystatechange = () => {
		if (xhr.readyState !== 4 && xhr.status !== 200) {
			return;
		}

		let json = JSON.parse(xhr.responseText);

		if (json.error == 1) {
			var icon = 'warning.png';
			var timeout = 60 * 1000;

			chrome.notifications.create('filkom_attendance_checker', {
				type: 'basic',
				iconUrl: 'warning.png',
				title: 'FILKOM Attendance Checker',
				message: 'Access error!',
				buttons: [
					{title: 'Open attendance page'}
				]
			});
		} else if (json.present == 1) {
			var icon = 'ok.png'
			var timeout = 10 * 60 * 1000;
		} else {
			var icon = 'warning.png';
			var timeout = 60 * 1000;
			var ratio = json.ratio.toFixed(2);

			chrome.notifications.create('filkom_attendance_checker', {
				type: 'basic',
				iconUrl: 'warning.png',
				title: 'FILKOM Attendance Checker',
				message: `Anda belum hadir! (Ratio: ${ratio})`,
				buttons: [
					{title: 'Open attendance page'}
				]
			});
		}

		chrome.browserAction.setIcon({path: icon});
		setTimeout(check, timeout);
	};

	xhr.send(null);
};