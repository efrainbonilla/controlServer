<?php

namespace AppBundle;

/**
 * Contains all events thrown in the AppEvents
 */
final class AppEvents
{
    /**
     * The REGISTRATION_SUCCESS event occurs when the registration form is submitted successfully.
     *
     * This event allows you to set the response instead of using the default one.
     * The event listener method receives a FOS\UserBundle\Event\FormEvent instance.
     */
    const REGISTRATION_SUCCESS = 'app.registration.success';

    /**
     * The REGISTRATION_COMPLETED event occurs after saving the user in the registration process.
     *
     * This event allows you to access the response which will be sent.
     * The event listener method receives a FOS\UserBundle\Event\FilterUserResponseEvent instance.
     */
    const REGISTRATION_COMPLETED = 'app.registration.completed';

    /**
     * The REGISTRATION_CONFIRM event occurs just before confirming the account.
     *
     * This event allows you to access the user which will be confirmed.
     * The event listener method receives a FOS\UserBundle\Event\GetResponseUserEvent instance.
     */
    const REGISTRATION_CONFIRM = 'app.registration.confirm';
}
