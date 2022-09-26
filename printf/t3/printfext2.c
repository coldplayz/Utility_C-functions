#include <stdarg.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include "main.h"

/**
 * printfext2 - produces output according to
 * a format. An extension of _printf
 *  @ap: argument pointer recieved from printfext1
 *  @c: character specifying format to print argument in.
 *
 *  Return: a pointer to an array of two integers, the first being the number
 *  of characters printed,excluding the string-terminating null character, and
 *  the second being a flag indicating a signal based on the function called.
 */
int *printfext2(va_list ap, char c)
{
	int *pti, ai[2] = {0, 0};

	pti = ai;
	switch (c)
	{
		case 's':
			pti = prints(va_arg(ap, char *));
			break;
		default:
			pti[0] = printfext1(ap, c);
	}
	return (pti);
}
