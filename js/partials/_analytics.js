function sendEvent(c, a, l, v) {
  if (v) {
    //ga('send', 'event', { eventCategory: c, eventAction: a, eventLabel: l, eventValue:v });

    gtag('event', a, {
      'event_category': c,
      'event_label': l,
      'value': v
    });

    if (testing) {
      console.log('CATEGORY: '+c+', ACTION:'+a+', LABEL:'+l+', VALUE:'+v);
    }
  } else if (l) {
    
    gtag('event', a, {
      'event_category': c,
      'event_label': l
    });

    if (testing) {
      console.log('CATEGORY: '+c+', ACTION:'+a+', LABEL:'+l);
    }
  } else {
    
    gtag('event', a, {
      'event_category': c
    });

    if (testing) {
      console.log('CATEGORY: '+c+', ACTION:'+a);
    }
    
  }
}