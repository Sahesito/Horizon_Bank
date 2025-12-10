import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'

const Home = () => {

    const loggedIn = { firstName: 'Erwin', lastName: 'Marchan', email:'mar.sosaer5@gmail.com'}

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox 
                        type="greeting"
                        title="Bienvenido"
                        user={loggedIn?.firstName || 'Usuario'}
                        subtext = "Acceda y administre su cuenta y transacciones de manera eficiente."
                    />

                    <TotalBalanceBox 
                        accounts={[]}
                        totalBanks={1}
                        totalCurrentBalance={1250.35}
                    />
                </header>

                TRANSACCIONES RECIENTES
            </div>

            <RightSidebar 
                user={loggedIn}
                transactions={[]}
                banks={[{currentBalance:1235.50}, {currentBalance:500.50}]}
            />
        </section>
    )
}

export default Home