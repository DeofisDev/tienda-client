function inicializarNotificaciones(target, email) {
    (function(i, s, o, g, r, a, m) {
        i['MagicBellObject'] = r;
        (i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments);
        }), (i[r].l = 1 * new Date());
        (a = s.createElement(o)), (
            m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://assets.magicbell.io/magicbell.min.js', 'magicbell');

    var options = {
        apiKey: "fe895cc2053486135913f5557c5fae1ca049a04e",
        userEmail: email,
        onNotificationClick: function(notification) {
            if (notification.actionUrl) window.open(notification.actionUrl, '_self');
        },
        height: 500,
        theme: { "icon": { "borderColor": "#757575", "width": "24px" }, "unseenBadge": { "backgroundColor": "#DF4759" }, "header": { "backgroundColor": "#007bff", "textColor": "#ffffff", "borderRadius": "16px", "fontFamily": null }, "footer": { "backgroundColor": "#007bff", "textColor": "#ffffff", "borderRadius": "16px", "fontFamily": null }, "notification": { "default": { "textColor": "#15091F", "borderRadius": "8px", "backgroundColor": "#007bff", "fontFamily": null }, "unseen": { "backgroundColor": "#007bff", "textColor": "#15091F", "borderRadius": "8px", "fontFamily": null }, "unread": { "backgroundColor": "#007bff", "textColor": "#15091F", "borderRadius": "8px", "fontFamily": null } } },
    };

    magicbell('render', target, options);

}