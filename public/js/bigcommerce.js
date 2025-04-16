let FFLConfigs = {
    storefrontApiToken: window.FFLStorefrontApiToken,
    checkoutId: window.FFLCheckoutId,
    storeHash: '',
    coupon: 'FFL',
    customerData: null,
    customerSelectedState: null,
    isFflLoaded: false,
    hasRegularProducts: false,
    hasAmmo: false,
    hasFirearm: false,
    isRunningShippingObserver: false,
    preventSubmition: false,
    preventSubmitionMessage: 'Please complete the FFL selection.',
    isEnhancedCheckoutEnabled: false,
    statesRequireAmmoFFL: [],
    ammoOnlyRequireFFLMessage: 'You have selected a state where ammunition must be shipped to an FFL holder.', // TODO: remove if no longer required
    ammoOnlyAddressChangedMessage: 'The shipping address has been updated. Please update the FFL holder.', // TODO: remove if no longer required
    ammoOnlyNoAddressRequiredMessage: 'The selected ammunition products do not require shipping to an FFL holder and will be sent to your provided shipping address.', // TODO: remove if no longer required
    ammoRequireFFL: false,
    ammoRequireFFLMessage: 'Your ammunition products will be shipped to this FFL holder due to the requirements of the selected state.',
    selectedDealer: null,
    hasNonFFLProducts: false,
    hasFFLProducts: false,
    isMixedCart: false,
    platform: 'BigCommerce',
    automaticFFLStoreInfoEndpointUrl: window.FFL_ENVIRONMENT.FFL_STORE_ENDPOINT,
    automaticFFLIframeUrl: window.FFL_ENVIRONMENT.FFL_IFRAME_URL,
    css: `.ffl-section .alertBox--font-color-black {
          color: #000;
          border-radius: 3px;
      }
      // Hides 3rd consignment (we will never use it). If empty, checkout will delete it for us.
      div.consignment-container + div.consignment-container + div.consignment-container {
            display: none !important;
      }
     .checkout-form div:nth-child(3) .dropdownTrigger, .checkout-form div:nth-child(3) .alertBox--error {
        display: none;
      }
      .delete-consignment, .reallocate-items-button, a[data-test="reallocate-items-button"] {
        display: none;
      }
      .consignment {
          display: flex;
          flex-direction: row;
          margin: .75rem 0 1.5rem;
          width: 100%;
      }

      .consignment-product-figure {
          padding: 0 1.5rem 0;
          width: 25%;
      }
      .consignment-product-body {
          display: flex;
          flex-direction: column;
          width: 100%;
      }
      .consignment-product-body h5 {
          margin-bottom: .1875rem;
      }
      #ffl-message, #ffl-message-iframe {
         display: none;
         background-color: black;
      }
      #ffl-message-alert-modal {
        width: 100%;
        margin-top: 20%;
         @media (min-width: 600px) {
            width: 470px;
            margin-top: initial;
         }
         display: none;
         visibility: visible;
         padding: 20px 20px 0 20px;
         text-align: center;
      }
      #ffl-message-alert-modal .modal-content {
        padding-bottom: 20px;
      }
      #ffl-message-alert-modal .modal-alert-icon {
        width: 76px;
        height: 76px;
        margin: 1.25em auto 1.875em;
      }
      #ffl-message-alert-modal h4 {
        margin-bottom: 10px;
      }
      #ffl-message-alert-modal #ffl-alert-state-info {
        margin-top: 8px; border-radius: 6px;
      }
      #ffl-message-iframe-modal {
        display: none;
        width: 100%;
        height: 100%;
        visibility: visible;
        transform: scale(1) translateY(-50%);
        max-width: 85%;
        max-height: 85%;
        overflow: visible;
        @media (max-width: 551px) {
          transform: none;
          max-width: 100%;
          min-height: initial;
          bottom: 0;
          max-height: 90%;
          height: 90%;
          top: initial;
        }
      }
      #ffl-message-iframe-modal iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
      #ffl-message-iframe-close {
        width: 22px;
        position: absolute;
        right: 0;
        margin: -10px;
        cursor: pointer;
        @media (max-width: 551px) {
          margin: -13px 5px;
        }
      }
      #ffl-message-iframe-modal .modal-content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 6px;
        @media (max-width: 551px) {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
      #checkout-payment-continue {
        display: none;
      }
      #ffl-alert-state-info {
        display: none;
        background-color: #feffd7;
        padding: 13px 20px;
        width: 100%;
        margin-bottom: 15px;
        border-radius: 3px;
      }
      `
}

let filteredProducts = {
    fireArm: [],
    ammo: [],
    others: []
};

const htmlTemplates = {
    fflStep: `<div class="checkout-view-header">
            <div class="stepHeader is-readonly">
                <div class="stepHeader-figure stepHeader-column">
                  <div class="icon stepHeader-counter optimizedCheckout-step">
                      <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                      </svg>
                  </div>
                  <h2 class="stepHeader-title optimizedCheckout-headingPrimary" id="shipping-ffl">Shipping FFL</h2>
                </div>
            </div>
          </div>
          <div aria-busy="false" class="checkout-view-content checkout-view-content-enter-done">
            <section class="ffl-section checkout-form">
                <div>
                  <div id="ffl-alert" class="alertBox alertBox--error alertBox--font-color-black">
                      %items%
                      %fflInfo%
                  </div>
                  <div class="form-action"><button type="button" class="button button--primary optimizedCheckout-buttonPrimary" id="ffl-select-dealer" onclick="showFFLDealerModal()">SELECT YOUR DEALER (FFL)</button></div>
                </div>
            </section>
          </div>`,
    fflInfo: `<div id="ffl-info" class="alertBox-column alertBox-message">
        <p>You have purchased an item that must be shipped to a Federal Firearms License holder (FFL).</p>
        <p>Before making a selection, contact the FFL and verify that they can accept your shipment prior to completing your purchase.</p>
      </div>`,
    fflItems: `<li>
        <div class="consignment ffl-item ffl-%product_type%" style="display: none">
            %product_image%
            <div class="consignment-product-body">
              <h5 class="optimizedCheckout-contentPrimary">%product_qty% x %product_name%</h5>
            </div>
        </div>
      </li>`,
    fflMessage: `<div id="ffl-message" class="modal-background"></div>
        <div id="ffl-message-alert-modal" class="modal modal--alert modal--small" tabindex="0">
            <div class="modal-alert-icon"><img src="${FFLConfigs.automaticFFLIframeUrl}/bigcommerce-alert-icon.svg" alt=""/></div>
            <div class="modal-content"></div>
            <div class="button-container"></div>
            <div class="loadingOverlay" style="display: none;"></div>
        </div>`,
    fflMessageDefaultButton: `<button type="button" class="confirm button" onclick="hideMessage()">OK</button>`,
    fflMessageState: `<h4>Ammunition shipments must go<br/>through an FFL dealer in some states.</h4>
            <form id="ffl-message-state-form">
            <div class="form-field">
                <label for="ffl-province-code-input" id="ffl-province-code-input-label" class="form-label optimizedCheckout-form-label">Please select your shipping state:</label>
                <div class="dropdown-chevron"><div class="icon"><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></div></div><select required class="form-select optimizedCheckout-form-select" id="ffl-province-code-input" onchange="handleStateSelected()"><option value="">Select a state</option><option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AS">American Samoa</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="AA">Armed Forces Americas</option><option value="AE">Armed Forces Europe</option><option value="AP">Armed Forces Pacific</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="DC">District of Columbia</option><option value="FM">Federated States Of Micronesia</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="GU">Guam</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MH">Marshall Islands</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="MP">Northern Mariana Islands</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PW">Palau</option><option value="PA">Pennsylvania</option><option value="PR">Puerto Rico</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VI">Virgin Islands</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option></select>
            </div>
            </form>
            <div id="ffl-alert-state-info"></div>
        </div>`,
    fflMessageStateButton: `<button type="button" class="confirm button button--primary optimizedCheckout-buttonPrimary" onclick="handleCloseStateModal()">CONFIRM</button>`,
    fflModal: `<div id="ffl-message-iframe" class="modal-background"></div>
        <div id="ffl-message-iframe-modal" class="modal modal--alert modal--small" tabindex="0">
            <div id="ffl-message-iframe-close" onclick="hideFFLDealerModal()"><img src="${FFLConfigs.automaticFFLIframeUrl}/bigcommerce-close-icon.svg" alt=""/></div>
            <div class="modal-content">
                <iframe src="%url%"></iframe>
            </div>
            <div class="loadingOverlay" style="display: none;"></div>
        </div>`
};

const graphqlPayloads = {
    userInformationQuery: `
      query {
        customer {
          entityId
          firstName
          lastName
        }
      }
    `,
    siteSettingsQuery: `
      query {
        site {
          settings {
            storeHash
          }
        }
      }
    `,
    cartProductsQuery: `
      query {
        site {
          cart {
            lineItems {
              physicalItems {
                entityId
                productEntityId
                quantity
                name
                image {
                  url(width: 120)
                }
              }
              digitalItems {
                entityId
                productEntityId
                quantity
                name
                image {
                  url(width: 120)
                }
              }
              giftCertificates {
                entityId
              }
              customItems {
                entityId
              }
            }
          }
        }
      }
    `,
    productDetailsQuery: `
      query {
        site {
          products(entityIds: [%product_ids%]) {
            edges {
              node {
                id
                entityId
                customFields {
                  edges {
                    node {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    shippingConsignmentsQuery: `
      query {
        site {
          checkout {
            shippingConsignments {
              address {
                address1
                city
                stateOrProvinceCode
                postalCode
                phone
                countryCode
              }
            }
          }
        }
      }
    `,
    shippingConsignmentsMutation: `
      mutation addCheckoutShippingConsignments(
  $addCheckoutShippingConsignmentsInput: AddCheckoutShippingConsignmentsInput!
) {
  checkout {
    addCheckoutShippingConsignments(input: $addCheckoutShippingConsignmentsInput) {
      checkout {
        entityId
        shippingConsignments {
          entityId
          lineItemIds
          address {
            address1
            city
            stateOrProvinceCode
            postalCode
            phone
            countryCode
          }
          availableShippingOptions {
            entityId
            description
            cost {
              value
              currencyCode
            }
          }
          selectedShippingOption {
            entityId
          }
        }
      }
    }
  }
}
    `
};

async function fetchGraphQLData(query, variables = {}) {
    try {
        const response = await fetch('/graphql', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${FFLConfigs.storefrontApiToken}`
            },
            body: JSON.stringify({query, variables})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("FFL Shipment: Failed to fetch GraphQL data:", error);
        return null;
    }
}

/**
 * TODO: get the correct data for isEnhancedCheckoutEnabled and statesRequireAmmoFFL
 **/
async function initFFLConfigs() {
    FFLConfigs.storeHash = await getStoreHash();
    const url = FFLConfigs.automaticFFLStoreInfoEndpointUrl + FFLConfigs.storeHash;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        FFLConfigs.isEnhancedCheckoutEnabled = true;
        FFLConfigs.statesRequireAmmoFFL = data.ammo_states ?? ['AK', 'CA', 'CT', 'DC', 'HI', 'IL', 'MA', 'NY'];
    } catch (error) {
        console.error("FFL Shipment: Failed to fetch data:", error);
    }
}

/**
 * This function is triggered at {@link handleLoginOrLogout} by a Mutation Observer.
 * When firearm products are included in the `filteredProducts`, it will fetch the user information
 * and update the FFLConfigs.isGuestUser to true.
 *
 * If a dealer is not selected yet, it will trig {@link backToCustomerCheckoutStep}
 *
 * @returns {Promise<void>}
 */
async function checkIfGuestUser() {
    if (filteredProducts.fireArm.length === 0) {
        return;
    }

    const data = await fetchGraphQLData(graphqlPayloads.userInformationQuery);

    // User logs in
    if (FFLConfigs.isFflLoaded === false && data.customer?.entityId) {
        FFLConfigs.customerData = data.customer;
        if (FFLConfigs.hasFFLProducts) {
            const targetSelector = '.checkout-steps';
            // Also check immediately in case it's already in the DOM
            if (document.querySelector(targetSelector)) {
                addFFLCheckoutStep();
            } else {
                // The element os not loaded yet; init observer
                const observer = new MutationObserver((mutations, observerInstance) => {
                    const checkoutSteps = document.querySelector(targetSelector);
                    if (checkoutSteps) {
                        addFFLCheckoutStep();
                        observerInstance.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        } else {
            displayAllAfterCustomer();
        }
    } else if (FFLConfigs.isFflLoaded === true) {
        // Reload consignments and toggle coupon if the user logs out and in again
        await setShippingConsignments(FFLConfigs.selectedDealer);
        FFLConfigs.customerData = data.customer;
    }
}

/**
 * Displays all checkout steps after Customer
 */
function displayAllAfterCustomer()
{
    const shippingSection =  document.querySelector('.checkout-step--shipping');
    const billingSection =  document.querySelector('.checkout-step--billing');
    const paymentSection =  document.querySelector('.checkout-step--payment');

    shippingSection.style.display = 'block';
    billingSection.style.display = 'block';
    paymentSection.style.display = 'block';
}

async function getStoreHash() {
    const data = await fetchGraphQLData(graphqlPayloads.siteSettingsQuery);
    return data.site.settings.storeHash || null;
}

async function getCartProducts() {
    const data = await fetchGraphQLData(graphqlPayloads.cartProductsQuery);

    if (!data) return null;

    const physicalItems = data.site.cart.lineItems.physicalItems || [];
    const digitalItems = data.site.cart.lineItems.digitalItems || [];
    const giftCertificates = data.site.cart.lineItems.giftCertificates || [];
    const customItems = data.site.cart.lineItems.customItems || [];

    if (giftCertificates.length > 0 || customItems.length > 0) {
        FFLConfigs.hasNonFFLProducts = true;
    }

    return [...physicalItems, ...digitalItems];
}

async function getProductDetailsByIds(productIds) {
    const query = graphqlPayloads.productDetailsQuery.replace('%product_ids%', productIds);
    const data = await fetchGraphQLData(query);

    if (!data) return null;

    return data.site.products.edges.map(edge => edge.node);
}

/**
 * Retrieves shipping consignments for the current cart
 * @returns {Promise<*|null>}
 */
async function getShippingConsignments() {
    const data = await fetchGraphQLData(graphqlPayloads.shippingConsignmentsQuery);
    return data?.site.checkout.shippingConsignments[0]?.address || null;
}

/**
 * This function deletes all consignments in the current cart
 * @returns {Promise<void>}
 */
async function deleteAllConsignments() {
    try {
        const data = await fetchGraphQLData(`
            query {
                site {
                    checkout {
                        shippingConsignments {
                            entityId
                        }
                    }
                }
            }
        `);

        const consignments = data?.site?.checkout?.shippingConsignments || [];

        for (const consignment of consignments) {
            await fetchGraphQLData(`
                mutation {
                    checkout {
                        deleteCheckoutConsignment(input: {
                            checkoutEntityId: "${FFLConfigs.checkoutId}",
                            consignmentEntityId: "${consignment.entityId}"
                        }) {
                            checkout {
                                entityId
                            }
                        }
                    }
                }
            `);
        }

    } catch (error) {
        console.error("Failed to delete consignments:", error);
    }
}

/**
 * Creates separate consignments for regular and FFL products.
 * The first consignment will have the dealer address data, while the second consignment has invalid data.
 * DO NOT remove the empty space in the `city` field. If all fields are empty, BigCommerce will just ignore
 * the consignment.
 *
 * @param dealerData
 * @returns {Promise<void>}
 */
async function setShippingConsignments(dealerData) {
    await deleteAllConsignments();

    const fflLineItems = [];
    const otherLineItems = []
    const shipAmmoWithFfl = FFLConfigs.statesRequireAmmoFFL.includes(dealerData.stateOrProvinceCode);

    filteredProducts.fireArm.forEach(product => {
        fflLineItems.push({
            lineItemEntityId: product.entityId,
            quantity: product.quantity,
        });
    });

    filteredProducts.ammo.forEach(product => {
        // Ship ammo with FFL or Other products
        if (shipAmmoWithFfl) {
            fflLineItems.push({
                lineItemEntityId: product.entityId,
                quantity: product.quantity,
            });
        } else {
            otherLineItems.push({
                lineItemEntityId: product.entityId,
                quantity: product.quantity,
            });
        }
    });

    filteredProducts.others.forEach(product => {
        otherLineItems.push(
            {
                lineItemEntityId: product.entityId,
                quantity: product.quantity,
            }
        );
    })

    /**
     * Now verify again if the cart is mixed, and if there is an FFL product in it, according with the new
     * established criteria.
     */
    FFLConfigs.hasFFLProducts = fflLineItems.length > 0;
    FFLConfigs.isMixedCart = otherLineItems.length > 0 && FFLConfigs.hasFFLProducts;

    // Updates customer data
    const customerData = await fetchGraphQLData(graphqlPayloads.userInformationQuery);
    FFLConfigs.customerData = customerData.customer;

    // Mixed carts need 2 consignments. Orders with FFL items only need just one.
    let customConsignments = [];

    if (FFLConfigs.isMixedCart) {
        customConsignments = [
            {
                address: {
                    firstName: FFLConfigs.customerData.firstName, // mandatory first and last name
                    lastName: FFLConfigs.customerData.lastName,
                    company: dealerData.company,
                    address1: dealerData.address1,
                    city: dealerData.city,
                    stateOrProvince: dealerData.stateOrProvinceCode,
                    stateOrProvinceCode: dealerData.stateOrProvinceCode,
                    postalCode: dealerData.postalCode,
                    phone: dealerData.phone,
                    countryCode: dealerData.countryCode,
                    shouldSaveAddress: false
                },

                lineItems: fflLineItems
            },
            {
                address: {
                    firstName: "",
                    lastName: "",
                    company: '',
                    address1: '',
                    city: ' ', // Do not remove this empty space
                    stateOrProvince: '',
                    stateOrProvinceCode: '',
                    postalCode: '',
                    phone: '',
                    countryCode: '',
                    shouldSaveAddress: false
                },

                lineItems: otherLineItems
            }
        ]
    } else if (FFLConfigs.hasFFLProducts) {
        customConsignments = [
            {
                address: {
                    firstName: FFLConfigs.customerData.firstName, // mandatory first and last name
                    lastName: FFLConfigs.customerData.lastName,
                    company: dealerData.company,
                    address1: dealerData.address1,
                    city: dealerData.city,
                    stateOrProvince: dealerData.stateOrProvinceCode,
                    stateOrProvinceCode: dealerData.stateOrProvinceCode,
                    postalCode: dealerData.postalCode,
                    phone: dealerData.phone,
                    countryCode: dealerData.countryCode,
                    shouldSaveAddress: false
                },

                lineItems: fflLineItems
            }
        ]
    }

    if (customConsignments.length > 0) {
        const variables = {
            addCheckoutShippingConsignmentsInput: {
                checkoutEntityId: FFLConfigs.checkoutId,
                data: {
                    consignments: customConsignments
                }
            }
        };
        await fetchGraphQLData(graphqlPayloads.shippingConsignmentsMutation, variables);

        /**
         * Adds and removes a coupon from the cart to force the DOM update
         */
        toggleFflCoupon();
        // Not ideal to use setTimeout here but this is not sensitive information, since we already have this data
        // on the FFL Selector.
        setTimeout(() => {
            updateAddressDisplay(dealerData);
        }, 5000);

        if (customConsignments.length < 2 && !FFLConfigs.isRunningShippingObserver) {
            // Hide and add address block
            hideShippingStepAndAddAddressBlock();

            // Create a MutationObserver to watch for changes in the DOM
            const observer = new MutationObserver(() => {
                hideShippingStepAndAddAddressBlock();
            });

            // Start observing the body for added/changed elements
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            FFLConfigs.isRunningShippingObserver = true;
        }
    }
}

function hideShippingStepAndAddAddressBlock() {
    const checkoutStep = document.querySelector('#checkoutShippingAddress');
    if (checkoutStep && checkoutStep.style.display !== 'none') {
        // Add address block again
        insertFFLConsignmentBlock(FFLConfigs.selectedDealer);
        const shippingHeader = document.getElementsByClassName('shipping-header')[0];
        // Hide shipping header
        shippingHeader.style.display = 'none';
        // Hide shipping section
        checkoutStep.style.display = 'none';
    }
}

/**
 * Updates how the dealer address is displayed on the consignment
 * @param dealerData
 */
function updateAddressDisplay(dealerData) {
    const targetElement = document.querySelector('.checkout-form div:nth-child(3) .dropdownTrigger');
    if (targetElement) {
        let addressElement = document.getElementById('ffl-dealer-consignment-address');

        if (!addressElement) {
            addressElement = document.createElement('div');
            addressElement.id = 'ffl-dealer-consignment-address';
            targetElement.parentNode.insertBefore(addressElement, targetElement);
        }

        addressElement.innerHTML = `<b>${dealerData.company}</b> — ${dealerData.address1}, ${dealerData.stateOrProvinceCode}, ${dealerData.postalCode}, ${dealerData.phone}`;
    }
}

/**
 * Forces the DOM to be reloaded by adding and removing a coupon from the cart.
 */
function toggleFflCoupon() {
    const removeLink = document.querySelector('a[data-test="cart-price-callback"]');

    // If the removeLInk is being displayed, we already have a coupon in the cart...
    if (removeLink) {
        //... remove it and add it back
        const couponContent = document.querySelector('.cart-priceItem-postFix[data-test="cart-price-code"]').textContent;
        removeLink.click();
        addCouponCode(couponContent);
    } else {
        // Monitors the remove coupon button
        monitorRemoveCoupon();

        // Add custom FFLConfigs.coupon coupon to the cart, then remove it when the remove link is displayed (monitorRemoveCoupon()).
        addCouponCode();
    }
}

/**
 * Monitor the "remove" coupon link. If it shows up, click on it.
 */
function monitorRemoveCoupon() {
    const targetNode = document.querySelector('aside.layout-cart');
    const observer = new MutationObserver((mutations, observerInstance) => {
        const removeLink = document.querySelector('a[data-test="cart-price-callback"]');
        if (removeLink) {
            removeLink.click();
            const inputField = document.querySelector('input[name="redeemableCode"]');

            // Set color back to the original
            inputField.style.color = '';

            observerInstance.disconnect();
            if (inputField) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(inputField, ' ');
                const inputEvent = new Event("input", { bubbles: true });
                inputField.dispatchEvent(inputEvent);
            }
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
}

/**
 * Monitors the dom, looking for the "Ship to multiple addresses" button. We always want to go to the multishipping
 * checkout if we have FFL products in the cart. The user should not be allowed to go to the single checkout.
 */
function monitorShippingToggleButton() {
    const observer = new MutationObserver((mutations, obs) => {
        const link = document.querySelector('a[data-test="shipping-mode-toggle"]');

        if (FFLConfigs.isFflLoaded && link) {
            if (link.textContent.trim() === "Ship to multiple addresses") {
                link.click();
            }
            const style = document.createElement("style");
            style.innerHTML = 'a[data-test="shipping-mode-toggle"] { display: none !important; }';
            document.head.appendChild(style);
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Adds a coupon code to the cart using the form on the checkout page
 */
function addCouponCode() {
    const label = document.querySelector('a.redeemable-label');
    const inputField = document.querySelector('input[name="redeemableCode"]');

    if (!inputField) {
        label.click();
    }

    setTimeout(() => {
        const inputField = document.querySelector('input[name="redeemableCode"]');
        const applyButton = document.getElementById("applyRedeemableButton");

        if (inputField && applyButton) {
            // I had to use the native setter because of React
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            // Change color to white to hide the coupon code
            inputField.style.color = '#ffffff'
            nativeInputValueSetter.call(inputField, FFLConfigs.coupon);

            // Notifying React about the changes
            const inputEvent = new Event("input", { bubbles: true });
            inputField.dispatchEvent(inputEvent);

            setTimeout(() => {
                applyButton.click();
            }, 100);
            setTimeout(() => {
            }, 500);
        }
    }, 200);
}

/**
 * Filter the FFL, normal and ammo products into the filteredProducts object
 * @returns {Promise<void>}
 */
async function initFFLProducts() {
    const products = await getCartProducts();
    if (!products || products.length === 0) {
        console.log("FFL Shipment: No product IDs found in the cart.");
        return;
    }

    const productIds = products.map(product => product.productEntityId);
    const productDetails = await getProductDetailsByIds(productIds);
    if (!productDetails) {
        console.log("FFL Shipment: Failed to retrieve product details.");
        return;
    }

    productDetails.forEach(productDetail => {
        const fflTypeField = productDetail.customFields.edges.find(field => field.node.name.toLowerCase() === 'ffl_type');
        const fflField = productDetail.customFields.edges.find(field => field.node.name.toLowerCase() === 'ffl');
        let fullProductData = null;

        const matchedProduct = products.find(prod => prod.productEntityId === productDetail.entityId);

        if (fflTypeField || fflField) {
            const matchedProduct = products.find(prod => prod.productEntityId === productDetail.entityId);
            fullProductData = {...matchedProduct, ffl_type: fflTypeField ? fflTypeField.node.value.toLowerCase() : 'firearm'};
        }
        else
        {
            fullProductData = {...matchedProduct};
        }

        if ((fflTypeField && fflTypeField.node.value.toLowerCase() === 'firearm') || (fflField && fflField.node.value.toLowerCase() === 'yes')) {
            filteredProducts.fireArm.push(fullProductData);
            FFLConfigs.hasFFLProducts = true;
            FFLConfigs.hasFirearm = true;
        } else if (fflTypeField && fflTypeField.node.value.toLowerCase() === 'ammo') {
            filteredProducts.ammo.push(fullProductData);
            FFLConfigs.hasFFLProducts = true;
            FFLConfigs.hasAmmo = true;
        } else {
            filteredProducts.others.push(fullProductData);
            FFLConfigs.hasNonFFLProducts = true;
            FFLConfigs.hasRegularProducts = true;
        }
    });

    if (FFLConfigs.hasFFLProducts && FFLConfigs.hasNonFFLProducts) {
        FFLConfigs.isMixedCart = true;
    }
}

/**
 * Adds the React app as a step to the checkout.
 * @returns {Promise<void>}
 */
async function addFFLCheckoutStep() {
    const checkoutSteps = document.querySelector('.checkout-steps');
    if (!checkoutSteps) {
        console.error("FFL Shipment: Checkout steps container not found.");
        return;
    }
    // This is already being displayed
    if (FFLConfigs.isFflLoaded === true) {
        return;
    }

    const itemsHTML = [...filteredProducts.fireArm, ...filteredProducts.ammo].map(product => {
        return htmlTemplates.fflItems
            .replace('%product_type%', product.ffl_type)
            .replace(
                '%product_image%',
                product.image?.url ? `<figure class="consignment-product-figure"><img alt="${product.name}" src="${product.image?.url}"></figure>` : '<div class="consignment-product-figure"></div>',
            )
            .replace('%product_qty%', product.quantity)
            .replace(/%product_name%/g, product.name);
    }).join('');

    let fflTemplate = htmlTemplates.fflStep.replace('%items%', itemsHTML)
        .replace('%fflInfo%', htmlTemplates.fflInfo);
    fflTemplate += htmlTemplates.fflModal.replace('%url%', `${FFLConfigs.automaticFFLIframeUrl}?store_hash=${FFLConfigs.storeHash}&platform=${FFLConfigs.platform}`);

    const wrapperElement = document.createElement('li');
    wrapperElement.classList.add('checkout-step', 'optimizedCheckout-checkoutStep', 'checkout-step--shipping-ffl', 'ffl-items');
    wrapperElement.style.display = 'none';
    wrapperElement.innerHTML = fflTemplate;

    checkoutSteps.insertBefore(wrapperElement, checkoutSteps.firstChild);

    /**
     * @TODO: shouldn't this be displayed for ammo too?
     */
    if (filteredProducts.fireArm.length > 0) {
        setFFLVisibility('firearm');
    }

    FFLConfigs.isFflLoaded = true;
}

/**
 * Show delivery state modal if there is ammo in the cart
 * @returns void
 */
async function handleStateModal() {
    if (filteredProducts.ammo.length === 0) {
        return;
    }

    showMessage(htmlTemplates.fflMessageState, htmlTemplates.fflMessageStateButton);
}

/**
 * On state change, check if the ammo requires or not to be shipped to a Dealer
 * @returns void
 */
async function handleStateSelected() {
    const selectedState = document.getElementById('ffl-province-code-input').value;
    FFLConfigs.customerSelectedState = selectedState;
    const alertStateInfo = document.getElementById('ffl-alert-state-info');

    if (!selectedState) {
        alertStateInfo.style.display = 'none';
        return;
    }

    if (FFLConfigs.statesRequireAmmoFFL.includes(selectedState)) {
        alertStateInfo.innerHTML = `The chosen state <strong>requires</strong> an FFL for ammunition.`;
        FFLConfigs.ammoRequireFFL = true;
    } else {
        alertStateInfo.innerHTML = `The chosen state <strong>doesn't require</strong> an FFL for ammunition.`;
        FFLConfigs.ammoRequireFFL = false;
    }
    alertStateInfo.style.display = 'block';
}

/**
 * Validate the state modal form and shows the ammo if required
 * @returns void
 */
async function handleCloseStateModal() {
    const fflProvinceCodeInput = document.getElementById('ffl-message-state-form');
    fflProvinceCodeInput.checkValidity();
    if (!fflProvinceCodeInput.checkValidity()) {
        fflProvinceCodeInput.reportValidity()
        return;
    }

    if (FFLConfigs.ammoRequireFFL) {
        // Display FFL block if not being displayed yet
        addFFLCheckoutStep();
        setFFLVisibility('ammo');
    } else if (!FFLConfigs.hasFirearm) {
        displayAllAfterCustomer();
    }
    hideMessage();
}

/**
 * TODO: Check if state changed and return customer to the initial step
 */
async function checkIfStateChanged(shippingConsignments) {
    const state = shippingConsignments?.stateOrProvinceCode; // use the state defined on the modal instead
    const isSameAddress = isDealerAndShippingAddressSame(shippingConsignments)
    const hasAmmo = filteredProducts.ammo.length > 0;
    const ammoOnly = filteredProducts.fireArm.length === 0 && filteredProducts.ammo.length > 0 && !FFLConfigs.hasNonFFLProducts;
    const stateRequiresFFL = FFLConfigs.statesRequireAmmoFFL.includes(state)
}

/**
 * Returns a bool of whether the dealer address is exactly the same as the shipping address.
 * @param shippingAddress
 * @returns {boolean}
 */
function isDealerAndShippingAddressSame(shippingAddress) {
    let dealerData = FFLConfigs.selectedDealer;
    if (!shippingAddress || !dealerData) return false;

    return shippingAddress.address1 === dealerData.address1 &&
        shippingAddress.city === dealerData.city &&
        shippingAddress.stateOrProvinceCode === dealerData.stateOrProvinceCode &&
        shippingAddress.postalCode === dealerData.postalCode &&
        shippingAddress.phone === dealerData.phone &&
        shippingAddress.countryCode === dealerData.countryCode;
}

/**
 * Changes product visibility according with the type
 *
 * @param productType
 * @param display
 */
function setFFLVisibility(productType, display = 'flex') {
    const fflItemsElement = document.querySelector('.ffl-items');
    if (filteredProducts.fireArm.length === 0 && productType === 'ammo' && display === 'none') {
        FFLConfigs.preventSubmition = false;
        FFLConfigs.ammoRequireFFL = false;
        fflItemsElement.style.display = 'none';
        return;
    }
    if (productType === 'ammo') {
        FFLConfigs.ammoRequireFFL = display === 'flex';
    }
    FFLConfigs.preventSubmition = true;
    if (fflItemsElement) {
        fflItemsElement.style.display = 'block';
    }
    document.querySelectorAll(`.ffl-item.ffl-${productType}`).forEach(function (element) {
        element.style.display = display;
    });
}

function showFFLDealerModal() {
    if (!FFLConfigs.isMixedCart && FFLConfigs.selectedDealer !== null) {
        // We can't update the address if it is just one consignment, so we need to reload the page
        window.location.reload();
        return;
    }
    const alertBox = document.querySelector('#ffl-message-iframe');
    const alertBoxMessage = document.querySelector('#ffl-message-iframe-modal');
    Object.assign(alertBox.style, {display: 'block', opacity: '0.8'});
    Object.assign(alertBoxMessage.style, {display: 'block', opacity: '1'});
}

function hideFFLDealerModal() {
    const alertBox = document.querySelector('#ffl-message-iframe');
    const alertBoxMessage = document.querySelector('#ffl-message-iframe-modal');

    Object.assign(alertBox.style, {display: 'none', opacity: '0'});
    Object.assign(alertBoxMessage.style, {display: 'none', opacity: '0'});
}

async function handleDealerUpdate(event) {
    if (event?.data?.type === 'dealerUpdate') {
        FFLConfigs.selectedDealer = event.data.value;
        document.querySelector('#ffl-info').innerHTML = `<p>${event.data.value.addressFormatted}</p>`;

        // Verify if State is the same chosen by the user
        if (event.data.value.stateOrProvinceCode !== FFLConfigs.customerSelectedState) {
            // @TODO: User selected an ammo state different from the dealer. Show message
        }

        // Will set consignments when there is a mixed cart
        if (FFLConfigs.hasFFLProducts) {
            await setShippingConsignments(event.data.value);
            backToShippingCheckoutStep();
        } else if (filteredProducts.ammo.length > 0) {
            /**
             * @TODO: I think this is wrong. We should tell this to the user after the shipping address is set. At this point, we may not have consignments yet. This condition will not even trigger now because I'm considering ammo as an FFL product by default.
             *
             * @type {*|null}
             */
            let shippingConsignments = await getShippingConsignments();
            const state = shippingConsignments?.stateOrProvinceCode;

            if (FFLConfigs.statesRequireAmmoFFL.includes(state)) {
                setFFLVisibility('ammo');
                if (filteredProducts.fireArm.length > 0) {
                    showMessage(FFLConfigs.ammoRequireFFLMessage);
                }
            }
        }

        const fflAlert = document.querySelector('#ffl-alert');
        fflAlert.classList.add('alertBox--success');
        fflAlert.classList.remove('alertBox--error');

        document.querySelector('#ffl-select-dealer').innerText = 'CHANGE DEALER (FFL)';

        hideFFLDealerModal();
        displayAllAfterCustomer();
    }
}

/**
 * Setup the observer to prevent the checkout submission
 *
 * @param targetSelector
 * @param buttonSelector
 * @param eventHandler
 * @returns {Promise<void>}
 */
async function setupPreventSubmissionObserver(targetSelector, buttonSelector, eventHandler) {
    const processedElements = new WeakSet();

    const observer = new MutationObserver(() => {
        const continueButton = document.querySelector(buttonSelector);
        if (continueButton && !processedElements.has(continueButton)) {
            const editButtons = document.querySelectorAll(".stepHeader.is-clickable");
            [continueButton, ...editButtons].forEach(element => {
                if (!processedElements.has(element)) {
                    element.addEventListener('click', async (event) => {
                        await eventHandler(event);
                    });
                    processedElements.add(element);
                }
            });
        }
    });

    const targetNode = await waitForElement(targetSelector);
    observer.observe(targetNode, { childList: true, subtree: true, attributes: true });
}

/**
 * Prevents checkout submission during the shipping step
 * @returns {Promise<void>}
 */
async function preventSubmissionOnShipping() {
    const eventHandler = async () => {
        const shippingConsignments = await getShippingConsignments(); // TODO: may no longer be required because we will get the state info from a modal
        checkIfStateChanged(shippingConsignments);
    };

    await setupPreventSubmissionObserver(
        '.checkout-step--shipping',
        '#checkout-shipping-continue',
        eventHandler
    );
}

async function preventSubmissionOnPayment() {
    const observer = new MutationObserver(async () => {
        const test = await checkAmmoShippingAddress();


        handleSubmissionOnPayment();
    });

    const targetNode = await waitForElement('.checkout-step--payment');
    observer.observe(targetNode, { childList: true, subtree: true, attributes: true });
}

async function checkAmmoShippingAddress()
{
    console.log("getShippingConsignments()");
    const con = await getShippingConsignments();
    console.log(con);
    // address1.stateOrProvinceCode = FF
    //event.preventDefault();
}

function handleSubmissionOnPayment() {
    const element = document.querySelector("#checkout-payment-continue");
    if (element && !element.dataset.preventSubmissionEvent) {
        element.style.display = 'block';
        element.addEventListener('click', async (event) => {
            event.preventDefault();
            if (FFLConfigs.preventSubmition && !FFLConfigs.selectedDealer) {
                event.preventDefault();
                setTimeout(() => {
                    document.getElementById("shipping-ffl").scrollIntoView();
                }, 1000);
                showMessage(FFLConfigs.preventSubmitionMessage);
            }

            // Verifica se o primeiro consignment tem o estado correto se for só um
            // verifica se o segundo consignment tem o estado correto se forem dois

        });
        element.dataset.preventSubmissionEvent = "true";
    }
}

/**
 * Sends the user back to the Shipping Step on the checkout.
 */
function backToShippingCheckoutStep() {
    const shippingSelector = document.querySelector('.checkout-step--shipping .stepHeader-actions button');
    if (shippingSelector) {
        shippingSelector.click();
    }
}

function showMessage(message, customButton = false) {
    const alertBox = document.querySelector('#ffl-message');
    const alertBoxMessage = document.querySelector('#ffl-message-alert-modal');
    const alertBoxMessageContent = document.querySelector('#ffl-message-alert-modal .modal-content');
    const buttonContainer = document.querySelector('#ffl-message-alert-modal .button-container');

    Object.assign(alertBox.style, {display: 'block', opacity: '0.8'});
    Object.assign(alertBoxMessage.style, {display: 'block', opacity: '1'});

    alertBoxMessageContent.innerHTML = message;
    if (customButton) {
        buttonContainer.innerHTML = customButton;
    } else {
        buttonContainer.innerHTML = htmlTemplates.fflMessageDefaultButton;
    }
}

function hideMessage() {
    const alertBox = document.querySelector('#ffl-message');
    const alertBoxMessage = document.querySelector('#ffl-message-alert-modal');

    Object.assign(alertBox.style, {display: 'none', opacity: '0'});
    Object.assign(alertBoxMessage.style, {display: 'none', opacity: '0'});
}

/**
 * This function creates a Mutation Observer which will verify whether the user is logged or not (guest).
 * It will observe if the element `loggedUserStepElement` is added to the DOM. When that element shows up,
 * the function {@link checkIfGuestUser} will be triggered.
 *
 * @returns {Promise<void>}
 */
async function handleLoginOrLogout() {
    /**
     * The element observed to detect user login status changes.
     * @type {string}
     */
    const loggedUserStepElement = '.checkout-step.optimizedCheckout-checkoutStep.checkout-step--customer';

    await checkIfGuestUser();
    const targetNode = await waitForElement(loggedUserStepElement);
    const observer = new MutationObserver(() => checkIfGuestUser());
    observer.observe(targetNode, {childList: true});
}

async function waitForElement(selector) {
    while (!document.querySelector(selector)) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    return document.querySelector(selector);
}

function addFFLStyle() {
    const style = document.createElement('style');
    style.textContent = FFLConfigs.css;
    document.head.append(style);
}

function handleFFLCart() {
    handleStateModal();
    preventSubmissionOnPayment();
    setInterval(async () => {
        handleSubmissionOnPayment();
    }, 3000);
    addFFLStyle();
    monitorShippingToggleButton();
    preventSubmissionOnShipping();
}

(async () => {
    // Inject modal container
    document.body.insertAdjacentHTML('beforeend', htmlTemplates.fflMessage);

    if (!FFLConfigs.storefrontApiToken || !FFLConfigs.checkoutId) {
        console.error("FFL Shipment: Missing script params.");
        return;
    }
    await initFFLProducts();
    if (filteredProducts.fireArm.length === 0 && filteredProducts.ammo.length === 0) {
        console.log("FFL Shipment: No FFL products in the cart.");
        displayAllAfterCustomer();
        return;
    }
    await initFFLConfigs();
    if (!FFLConfigs.isEnhancedCheckoutEnabled) {
        console.log("FFL Shipment: FFL is disabled.");
        displayAllAfterCustomer();
        return;
    }

    await handleLoginOrLogout();

    if (FFLConfigs.hasFFLProducts) {
        handleFFLCart();
    } else {
        displayAllAfterCustomer();
    }

    window.addEventListener('message', handleDealerUpdate);
})();

/**
 * Insert block displaying the dealer shipping address, when just one consignment is created
 */
function insertFFLConsignmentBlock() {
    const containerHtml = `
        <div class="consignment-container">
            <div class="consignment-header"><h3>Destination</h3></div>
            <div class="form-field">
                <div class="dropdown--select">
                    <div id="ffl-dealer-consignment-address">
                        <b>${FFLConfigs.selectedDealer.company}</b> — ${FFLConfigs.selectedDealer.address1}, ${FFLConfigs.selectedDealer.city}, ${FFLConfigs.selectedDealer.stateOrProvinceCode}, ${FFLConfigs.selectedDealer.postalCode}, ${FFLConfigs.selectedDealer.phone}
                    </div>
                </div>
            </div>
            <div>
                <div class="customerView-actions">
                    <button class="button button--tertiary button--tiny optimizedCheckout-buttonSecondary"
                            data-test="go-back-to-ffl" type="button" onclick="javascript:window.location.reload()">Edit</button>
                </div>
            </div>
        </div>
    `;

    const target = document.querySelector('#checkoutShippingAddress');

    // Add block before the checkout shipping address header
    if (target && target.parentNode) {
        target.insertAdjacentHTML('beforebegin', containerHtml);
    }
}
