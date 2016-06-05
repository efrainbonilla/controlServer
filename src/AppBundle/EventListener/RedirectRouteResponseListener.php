<?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;

/**
 * Listener ta append Redirect-Route-Name.
 */
class RedirectRouteResponseListener
{
    /**
     * @param FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        if (null !== $event->getRequest()->get('_redirect_route_name')) {
            $event->getResponse()
                ->headers
                ->set('Redirect-Route-Name', $event->getRequest()->get('_redirect_route_name'));
        }
    }
}
