import React, { Component } from 'react';
import { Menu, Button, Icon} from 'semantic-ui-react';
import {Link} from '../routes';

const Header = ()=>{
    return (
        <Menu style={{marginTop: '10px'}}>
            
            <Link route="/">
                <a className="item">
               
                <Icon name ="bitcoin"></Icon>
                
                    CrowdCoin
                </a>

            </Link>
           
          
            <Menu.Menu position="right">
                <Link route="/">
                    <a className="item">
                        <Icon name ="map signs"></Icon>
                        Campaigns
                    </a>
                </Link>

                <Link route="/campaigns/new">
                    <a className="item">
                    +
                    </a>

                </Link>


            </Menu.Menu>
        </Menu>

    );

};

export default Header;
