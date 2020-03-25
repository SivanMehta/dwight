library(ggplot2)
library(dplyr)
dat <- read.csv('data.csv')

starting.balance = dat[1, ]$balance

dat %>%
  mutate(cycles = as.numeric(rownames(dat))) %>%
  ggplot() +
    geom_line(aes(cycles, balance), color = 'green') +
    geom_line(aes(cycles, price)) +
    geom_hline(yintercept = starting.balance)
