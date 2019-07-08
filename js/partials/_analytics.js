function sendEvent(c, a, l, v) {
  if (v) {
    dataLayer.push({
      'category': c,
      'action': a,
      'label': l,
      'value': v
    });

    //-ga('send', 'event', { eventCategory: c, eventAction: a, eventLabel: l, eventValue:v });
    //console.log('CATEGORY: '+c+', ACTION:'+a+', LABEL:'+l+', VALUE:'+v);
  } else if (l) {
    //-ga('send', 'event', { eventCategory: c, eventAction: a, eventLabel: l });

    dataLayer.push({
      'category': c,
      'action': a,
      'label': l
    });

    //console.log('CATEGORY: '+c+', ACTION:'+a+', LABEL:'+l);
  } else {

    dataLayer.push({
      'category': c,
      'action': a,
      'label': l
    });

    //ga('send', 'event', { eventCategory: c, eventAction: a });
    //console.log('CATEGORY: '+c+', ACTION:'+a);
  }
}