<?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;

/**
 * Listener ta append X-Total-Count.
 */
class XTotalCountResponseListener
{
    /**
     * @param FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        if (null !== $event->getRequest()->get('_x_total_count')) {
            $event->getResponse()
                ->headers
                ->set('X-Total-Count', $event->getRequest()->get('_x_total_count'));
        }
    }
}
