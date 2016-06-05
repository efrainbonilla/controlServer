<?php

namespace AppBundle\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

/**
 * JWTCreatedListener.
 *
 * @author Nicolas Cabot <n.cabot@lexik.fr>
 */
class JWTCreatedListener
{
    /**
     * @param JWTCreatedEvent $event
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        if (!($request = $event->getRequest())) {
            return;
        }

        $payload = $event->getData();
        $payload['ip'] = $request->getClientIp();

        $event->setData($payload);
    }
}
